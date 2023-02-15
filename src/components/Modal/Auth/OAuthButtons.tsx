import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { setDoc, collection, doc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

  //The work around if we are not using Cloud Function when creating a new user and store it to firestore
        
  // const createUserDocument = async (user: User) => {
  //   const userDocRef = doc(firestore, "users", user.uid);
  //     await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  // };

  // useEffect(() => {
  //     if(userCred) {
  //         createUserDocument(userCred.user);
  //     }
  // }, [userCred]);

  return (
    <Flex direction="column" mb={4} width="100%">
      <Button
        variant="oauth"
        mb={2}
        onClick={() => signInWithGoogle()}
        isLoading={loading}
      >
        <Image alt="Google Logo" src="/images/googlelogo.png" height="20px" mr={4} />
        Continue with Google
      </Button>
      <Button variant="oauth">Some Other Provider</Button>
      {error && (
        <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
          {error.message}
        </Text>
      )}
    </Flex>
  );
};
export default OAuthButtons;
