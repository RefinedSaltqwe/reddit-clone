import { Alert, AlertIcon, Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItemComponent from './TabItem';
import TextInputs from './TextInputs';
import ImageUpload from './ImageUpload';
import { storage, firestore} from '@/firebase/clientApp';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import router, { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import { Post } from '../../../atoms/postsAtom';
import useSelectFile from '../../../hooks/useSelectFile';

const formTabs = [
    {
      title: "Post",
      icon: IoDocumentText,
    },
    {
      title: "Images & Video",
      icon: IoImageOutline,
    },
    {
      title: "Link",
      icon: BsLink45Deg,
    },
    {
      title: "Poll",
      icon: BiPoll,
    },
    {
      title: "Talk",
      icon: BsMic,
    },
  ];
  
  export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
  };

  type NewPostFormProps = {
    user: User;
    communityImageURL?: string
  };
  
  const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {

    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();
    const [textInputs, setTextInputs] = useState({
        title:'',
        body: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCreatePost = async () => {

        const { communityId } = router.query;
        //CREATE new post object => type Post
        const newPost: Post = {
            communityId: communityId as string,
            communityImageURL: communityImageURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split("@")[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
            // editedAt: serverTimestamp(),
        };
        setLoading(true);
        //STORE the post in DB
        try{
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            //CHECK for selectedFIle
            if(selectedFile) {

                //STORE in storage => getDownloadURL (return imageURL)
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);

                //UPDATE post doc by adding imageURL
                await updateDoc(postDocRef, { imageURL: downloadURL });
                console.log("HERE IS DOWNLOAD URL", downloadURL);
                setError(false);
            }
            //REDIRECT the user back to the communityPage using the router
            router.back();
        } catch(error){
            console.log("handleCreatePost Error: ", error);
            setError(true);
        }
        setLoading(false);

        
    };

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {
            target: { name, value },
        } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
          <Flex width="100%">
            {formTabs.map((item, index) => (
              <TabItemComponent
                key={index}
                item={item}
                selected={item.title === selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ))}
          </Flex>
          <Flex p={4}>
            {selectedTab === "Post" && (
              <TextInputs
                textInputs={textInputs}
                onChange={onTextChange}
                handleCreatePost={handleCreatePost}
                loading={loading}
              />
            )}
            {selectedTab === "Images & Video" && (
              <ImageUpload
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setSelectedTab={setSelectedTab}
                onSelectImage={onSelectFile}
              />
            )}
          </Flex>
          {error && (
            <Alert status='error'>
                <AlertIcon />
                Error Creating post
            </Alert>
          )}
        </Flex>
      );
}
export default NewPostForm;