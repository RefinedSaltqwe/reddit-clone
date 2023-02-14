import { Stack } from '@chakra-ui/react'
import { Inter } from '@next/font/google'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Post, PostVote } from '../atoms/postsAtom'
import CreatePostLink from '../components/Community/CreatePostLink'
import PersonalHome from '../components/Community/PersonalHome'
import Premium from '../components/Community/Premium'
import Recommendations from '../components/Community/Recommendations'
import PageContentLayout from '../components/Layout/PageContent'
import PostItem from '../components/Posts/PostItem'
import PostLoader from '../components/Posts/PostLoader'
import { auth, firestore } from '../firebase/clientApp'
import useCommunityData from '../hooks/useCommunityData'
import usePosts from '../hooks/usePosts'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {communityStateValue} = useCommunityData();
  const { postStateValue ,setPostStateValue, onDeletePost, onSelectPost, onVote } = usePosts();

  const buildUserHomeFeed = async () => {
    //FETCH some posts from each community that the user is in
    setLoading(true);
      try{
        // CHECK current user's mySnippets
        if(communityStateValue.mySnippets.length){
          //GET user's communityIds from user/mySnippets
          const myCommunityIds = communityStateValue.mySnippets.map(
            (snippet) => snippet.communityId);
            // GRAB posts
            const postQuery = query(
              collection(firestore, "posts"),
              where("communityId","in", myCommunityIds),
              limit(10)
            );
            const postDocs = await getDocs(postQuery);
            // CONVERT data
            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            // SET data to Recoil State
            setPostStateValue((prev) => ({
              ...prev,
              posts: posts as Post[]
            }));

        } else {
          buildNoUserHomeFeed();
        }
      } catch(error) {
        console.log("buildNoUserHomeFeed Error: ", error);
      }
      setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
      setLoading(true);
      try{
          // GRAB posts
          const postQuery = query(
            collection(firestore, "posts"),
            orderBy("voteStatus", "desc"),
            limit(10)
          );
          const postDocs = await getDocs(postQuery);
          // CONVERT data
          const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          // SET data to Recoil State
          setPostStateValue((prev) => ({
            ...prev,
            posts: posts as Post[]
          }))
      } catch(error) {
        console.log("buildNoUserHomeFeed Error: ", error);
      }
      setLoading(false);
  };

  const getUserPostVotes = async () => {
    try{
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
          // CONVERT data
          const postVotes = postVoteDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          // SET data to Recoil State
          setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[]
          }))
    } catch(error) {
      console.log("getUserPostVotes Error: ", error);
    }
  };

  //userEffects
  useEffect(() => {
    if(communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if(!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser])

  useEffect(() => {
    if(user && postStateValue.posts.length) getUserPostVotes();
    
    // CLEAN Recoil when we leave from this page
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: []
      }))
      
    }
  }, [user, postStateValue.posts])

  return (
    <PageContentLayout>
        <>
        <CreatePostLink />
          {loading ? (
            <PostLoader/>
          ) : (
              <Stack>
                {postStateValue.posts.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        userIsCreator={user?.uid === post.creatorId}
                        userVoteValue={
                            postStateValue.postVotes.find((vote) => vote.postId === post.id)
                            ?.voteValue
                        }
                        onVote={onVote}
                        onSelectPost={onSelectPost}
                        onDeletePost={onDeletePost}
                        homePage={true}
                    />
                ))}
            </Stack>
          )}
        </>
        <Stack spacing={4}>
          <Recommendations/>
          <Premium/>
          <PersonalHome />
        </Stack>
    </PageContentLayout>
  )
}
