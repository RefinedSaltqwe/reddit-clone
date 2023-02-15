import { Community } from '../../atoms/communitiesAtom';
import React, { useEffect, useState } from 'react';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import { query, collection, where, orderBy, getDocs } from 'firebase/firestore';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData?: Community,
};

const Posts:React.FC<PostsProps> = ({ communityData }) => {

    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false);
    
    const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost} = usePosts();
    
    const getPosts = async () => {
        // console.log("WE ARE GETTING POSTS!!!");
    
        setLoading(true);
        try {
            //GET posts for thsi community
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData?.id!),
                orderBy("createdAt", "desc")
            );
            const postDocs = await getDocs(postsQuery);
            //EXTRACT all the data and store them into a javascript object so we can store them into recoil
            //STORE in post state
            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPostStateValue((prev) => ({
                ...prev, //Grab the previous data object/fields and spread it. Because we're only gonna update a single field
                posts: posts as Post[], // UPDATE the field 
            }));
            // console.log('data; ', posts);
        } catch (error: any) {
          console.log("getPosts error", error.message);
        }
        setLoading(false);
      };

    useEffect(() => {
        getPosts();
    }, [communityData]);// eslint-disable-next-line react-hooks/exhaustive-deps
    //     ↑ This will trigger whenever this data changes. Example when user goes to another community
    return (
        <>
        {loading ? (
            <PostLoader/>
        ):(
            <Stack>
                {postStateValue.posts.map((item: Post, index) => (
                    <PostItem
                        key={item.id}
                        post={item}
                        userIsCreator={user?.uid === item.creatorId}
                        userVoteValue={
                            postStateValue.postVotes.find((vote) => vote.postId === item.id)
                            ?.voteValue
                        }
                        onVote={onVote}
                        onSelectPost={onSelectPost}
                        onDeletePost={onDeletePost}
                    />
                ))}
            </Stack>
        )}
            
        </>
    )
}
export default Posts;