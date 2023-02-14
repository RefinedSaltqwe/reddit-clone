import { authModalState } from '../../../atoms/authModalAtom';
import { Post, postState } from '../../../atoms/postsAtom';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import CommentInput from './CommentInput';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '../../../firebase/clientApp';
import CommentItem, { Comment } from './CommentItem'

type CommentsProps = {
    user?: User | null;
    selectedPost: Post;
    communityId: string;
};

const Comments:React.FC<CommentsProps> = ({
    user,
    selectedPost,
    communityId,
}) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState("");
    const setAuthModalState = useSetRecoilState(authModalState);
    const setPostState = useSetRecoilState(postState);
    

    // console.log(selectedPost.communityId, " == ", communityId);
    const onCreateComment = async () => {
        //CHECK if user exist, if not then prompt to login
        if (!user) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }
        setCreateLoading(true);
        try{
            // DECLARE batch
            const batch = writeBatch(firestore);

            // CREATE a comment document
            const commentDocRef = doc(collection(firestore, 'comments'));
            const newComment: Comment = {
                id: commentDocRef.id,
                creatorId: user.uid,
                creatorDisplayText: user.email!.split('@')[0],
                communityId,
                postId: selectedPost?.id!,
                postTitle: selectedPost?.title!,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp
            };

            batch.set(commentDocRef, newComment);

            //CONVERT time for client
            newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

            // UPDATE post numberOfComments +1
            const postDocRef = doc(firestore, 'posts', selectedPost.id!);
            batch.update(postDocRef, {
                numberOfComments: increment(1),
            });

            await batch.commit();

            setCommentText("");
            // SET new comment at the top
            setComments(prev => [newComment, ...prev]);

            // UPDATE client Recoil State
            setPostState(prev => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1
                } as Post
            }));
        } catch (error) {
            console.log('onCreateComment: ', error);
        }
        setCreateLoading(false);
    };

    const onDeleteComment = async (comment: Comment) => {

        setDeleteLoading(comment.id as string);

        try{
            if (!comment.id) throw "Comment has no ID";
            const batch = writeBatch(firestore);

            // DELETE comment document
            const commentDocRef = doc(firestore, "comments", comment.id);
            batch.delete(commentDocRef);

            // UPDATE post numberOfComments -1
            const postDocRef = doc(firestore, "posts", comment.postId);
            batch.update(postDocRef, {
                numberOfComments: increment(-1),
            });

            //SAVE 
            await batch.commit();

            // UPDATE client Recoil State
            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1,
                } as Post,
                postUpdateRequired: true,
            }));

            setComments((prev) => prev.filter((item) => item.id !== comment.id));
        } catch (error) {
            console.log('onDeleteComment: ', error);
        }
        setDeleteLoading("");
    };

    const getPostComments = async () => {
        try {
            const commentsQuery = query(
              collection(firestore, "comments"),
              where("postId", "==", selectedPost.id),
              orderBy("createdAt", "desc")
            );
            const commentDocs = await getDocs(commentsQuery);
            const comments = commentDocs.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComments(comments as Comment[]);
          } catch (error: any) {
            console.log("getPostComments error: ", error.message);
          }
          setFetchLoading(false);
    };

    useEffect(() => {
        if(!selectedPost) return;
        // console.log("HERE IS SELECTED POST", selectedPost.id);
        getPostComments();
    }, [selectedPost])

    return (
        <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
            <Flex
                direction="column"
                pl={10}
                pr={4}
                mb={6}
                fontSize="10pt"
                width="100%"
            >
                {!fetchLoading && <CommentInput
                commentText={commentText}
                setCommentText={setCommentText}
                createLoading={createLoading}
                user={user}
                onCreateComment={onCreateComment}
                />}
            </Flex>
            <Stack spacing={6} p={2}>
                {fetchLoading ? (
                <>
                    {[0, 1, 2].map((item) => (
                        <Box key={item} padding="6" bg="white">
                            <SkeletonCircle size="10" />
                            <SkeletonText mt="4" noOfLines={2} spacing="4" />
                        </Box>
                    ))}
                </>
                ) : (
                <>
                    {!!comments.length ? (
                    <>
                        {comments.map((item: Comment) => (
                            <CommentItem
                                key={item.id}
                                comment={item}
                                onDeleteComment={onDeleteComment}
                                isLoading={deleteLoading === item.id}
                                userId={user?.uid}
                            />
                        ))}
                    </>
                    ) : (
                    <Flex
                        direction="column"
                        justify="center"
                        align="center"
                        borderTop="1px solid"
                        borderColor="gray.100"
                        p={20}
                    >
                        <Text fontWeight={700} opacity={0.3}>
                        No Comments Yet
                        </Text>
                    </Flex>
                    )}
                </>
                )}
            </Stack>
        </Box>
    )
}
export default Comments;