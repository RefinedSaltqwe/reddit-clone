import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Post } from '../../../../atoms/postsAtom';
import About from '../../../../components/Community/About';
import PageContentLayout from '../../../../components/Layout/PageContent';
import Comments from '../../../../components/Posts/Comments';
import PostItem from '../../../../components/Posts/PostItem';
import { auth, firestore } from '../../../../firebase/clientApp';
import useCommunityData from '../../../../hooks/useCommunityData';
import usePosts from '../../../../hooks/usePosts';

const PostPage:React.FC = () => {
    const [user] = useAuthState(auth)
    const { communityStateValue } = useCommunityData();
    const {
        postStateValue,
        setPostStateValue,
        onDeletePost,
        onVote,
      } = usePosts();
    const router = useRouter();
    // [pid] is the router name
    const { communityId, pid } = router.query;

    // Data for this page will be erased when page rehreshes
    // This page is dependent to community page when user clicks on a post 

    // GRABS data directly from database if page is refreshed
    const fetchPost = async (postId: string) => {
        try{
            const postDocRef = doc(firestore, "posts", postId);
            const postDoc = await getDoc(postDocRef);
            setPostStateValue((prev) => ({
                ...prev,
                selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
            }));
        } catch (error) {
            console.log("fetchPost error: ", error);
        }
    };

    // Fetch post if not in already in state
    useEffect(() => {
        
        //IF there is pid && no selected post it means the user refreshed the page or shared the link
        if (pid && !postStateValue.selectedPost) { 
            fetchPost(pid as string); //FETCH the selected post, if not exist
        }
    }, [router.query, postStateValue.selectedPost]); // eslint-disable-next-line react-hooks/exhaustive-deps
    //This function is dependent to router and selected post
    return (
        <PageContentLayout>
            <>
                {postStateValue.selectedPost && ( // CHECK if there is a selected post
                    <>
                        <PostItem 
                            post={postStateValue.selectedPost}
                            userIsCreator={ user?.uid === postStateValue.selectedPost.creatorId }
                            userVoteValue={
                                postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost!.id
                                )?.voteValue
                            }
                            onVote={onVote}
                            onDeletePost={onDeletePost}
                        />
                        <Comments
                            user={user}
                            communityId={communityId as string}
                            selectedPost={postStateValue.selectedPost}
                        />
                    </>
                )}
                

            </>
            <>
                {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity} />}
            </>
        </PageContentLayout>
    )
}
export default PostPage;