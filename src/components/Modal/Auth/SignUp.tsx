
import { authModalState } from '../../../atoms/authModalAtom';
import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import InputItem from '../../Layout/InputItem';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';


const SignUp:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    
    const [signUpForm, setSignUpForm] = useState({
        email:'',
        password:'',
        confirmPassword:''
    });

    const [error, setError] = useState("");

    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);

    //Firebase
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault(); // prevents to reload the page when submit is triggered
        const passwordSecurity=  /^[A-Za-z]\w{7,14}$/;

        if (error) setError("");

        if (!signUpForm.email.includes("@")) {
          return setError("Please enter a valid email");
        }
    
        if (signUpForm.password !== signUpForm.confirmPassword) {
          return setError("Passwords do not match");
        }
        if (signUpForm.password.length < 6) {
            return setError("Password should be at least 6 characters");
        }
        if (signUpForm.password.match(passwordSecurity)) {
            return setError("Password must contain Uppercase, Number and Special Character");
        }

        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);

        //The work around if we are not using Cloud Function when creating a new user and store it to firestore
        
        // const createUserDocument = async (user: User) => {
        //     await addDoc(collection(firestore, "users"), JSON.parse(JSON.stringify(user)));
        // };

        // useEffect(() => {
        //     if(userCred) {
        //         createUserDocument(userCred.user);
        //     }
        // }, [userCred]);

        if(!userError){
            setAuthModalState((prev) => ({
                ...prev,
                view:'login'
            }))
        } else {
            console.log(userError)
        }
        

    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //Update form state when there are changes in inputs
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    return (
        <form onSubmit={onSubmit}>
            <InputItem
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
            />
            <InputItem
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
            />
            <InputItem
                name="confirmPassword"
                placeholder="confirm password"
                type="password"
                mb={2}
                onChange={onChange}
            />
            
            <Text textAlign="center" mt={2} fontSize="10pt" color="red">
                {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS] }
            </Text>
            
            
            <Button 
                width="100%"
                height="36px"
                mb={2}
                mt={2}
                type="submit"
                isLoading={loading}
            >
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a redditor?</Text>
                <Text
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
                onClick={() => 
                    setAuthModalState((prev) => ({
                        ...prev,
                        view:'login'
                    }))
                }
                >
                LOG IN
                </Text>
            </Flex>
        </form>
      );
}
export default SignUp;