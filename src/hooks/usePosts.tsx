import { auth, firestore, storage } from '../firebase/clientApp';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postState, PostVote } from '../atoms/postsAtom';
import { deleteObject, ref } from 'firebase/storage';
import { doc, deleteDoc, writeBatch, collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { communityState } from '../atoms/communitiesAtom';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';

const usePosts = () => {
    
    const [user, loadingUser] = useAuthState(auth);
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const currentCommunity = useRecoilValue(communityState).currentCommunity;
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    //      The data of each post, since it was ran through a loop in Posts.tsx ↓ 
    const onVote = async (event: React.MouseEvent<SVGElement, MouseEvent>, post:Post, vote:number, communityId:string) => {
        event.stopPropagation();

        //CHECK for a user => if not, open auth modal
        if (!user?.uid) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }
        try{
            const { voteStatus } = post;
            const existingVote = postStateValue.postVotes.find((vote) => vote.postId === post.id);

            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            let voteChange = vote;

            //New Vote
            if(!existingVote){
                // console.log("Create");
                //CREATE a new postVote document
                const postVoteRef = doc(
                        collection(firestore, "users", `${user?.uid}/postVotes`)
                    );
            
                    const newVote: PostVote = {
                        id: postVoteRef.id,
                        postId: post.id!,
                        communityId,
                        voteValue: vote,
                    };
            
                    // console.log("NEW VOTE!!!", newVote);
            
                    batch.set(postVoteRef, newVote);
            
                    //ADD/SUBRACT 1 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus + vote;
                    updatedPostVotes = [...updatedPostVotes, newVote];
            }
            //Existing vote - they have voted on the post before
            else{
                // console.log("Else");
                const postVoteRef = doc(
                    firestore,
                    "users",
                    `${user?.uid}/postVotes/${existingVote.id}`
                );
                //REMOVING their vote (up=> neutral OR down => neutral)
                if(existingVote.voteValue === vote) {
                    // console.log("Neutral");
                    //ADD/SUBTRACT 1 to/from post.voteStatus
                    voteChange *= -1;
                    updatedPost.voteStatus = voteStatus - vote;
                    //REMOVE existing vote from the postVotes Array
                    updatedPostVotes = updatedPostVotes.filter(
                        (vote) => vote.id !== existingVote.id
                    );
                    //DELETE the postVOte document
                    batch.delete(postVoteRef);
                }
                //Flipping their vote (up=> down or down => up)
                else{
                    // console.log("Flip");
                    //ADD/SUBTRACT 2 to/from post.voteStatus
                    voteChange = 2 * vote;

                    updatedPost.voteStatus = voteStatus + 2 * vote;

                    const voteIdx = postStateValue.postVotes.findIndex(
                        (vote) => vote.id === existingVote.id
                    );

                    updatedPostVotes[voteIdx] = {
                    ...existingVote,
                    voteValue: vote,
                    };
                    
                    //UPDATING the existing postVote document
                    batch.update(postVoteRef, {
                        voteValue: vote,
                    });
                }
            }
            //UPDATE Recoil State  with Updated Values
            const postIdx = postStateValue.posts.findIndex(
                (item) => item.id === post.id
            );
            // console.log("index: ", postIdx);
            updatedPosts[postIdx] = updatedPost;
            setPostStateValue((prev) => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes
            }));

            /**
             * Optimistically update the UI
             * Used for single page view [pid]
             * since we don't have real-time listener there
             */
            if (postStateValue.selectedPost) {
                setPostStateValue((prev) => ({
                    ...prev,
                    selectedPost: updatedPost,
                }));
            }

            // UPDATE database
            const postRef = doc(firestore, "posts", post.id!);
            batch.update(postRef, { voteStatus: voteStatus + voteChange });
            await batch.commit();

        } catch (error){
            console.log('onVOte error: ', error);
        }
    };

    const onSelectPost = (post: Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post, 
        }));
        router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try{
            //CHECK if there is an image, delete if exists
            if(post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef);
            }
            //DELETE post document
            const postDocRef = doc(firestore, "posts", post.id!);
            await deleteDoc(postDocRef);
            //UPDATE recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter((item) => item.id !== post.id),
            }));
            return true;
        } catch(error){
            return false;
        }
    };
    //FETCH all of this current user's posts vote for the current community that they're currently in from the database
    //STORE them into Recoil so that we can determine if user has already voted to certain posts
    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where("communityId", "==", communityId)
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes as PostVote[],
        }));
    };

    useEffect(() => {
    if (!user?.uid || !currentCommunity) return;
        getCommunityPostVotes(currentCommunity.id);
    }, [user, currentCommunity]);

    //CLEAR user post votes if user logs out
    useEffect(() => {
        // Logout or no authenticated user
        if (!user?.uid && !loadingUser) {
          setPostStateValue((prev) => ({
            ...prev,
            postVotes: [],
          }));
          return;
        }
      }, [user, loadingUser]);
    
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}
export default usePosts;