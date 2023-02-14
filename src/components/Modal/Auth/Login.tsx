
import { authModalState } from '../../../atoms/authModalAtom';
import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/clientApp';
import InputItem from '../../Layout/InputItem';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type LoginProps = {
    // toggleView: (view: ModalView) => void;
};

const Login:React.FC<LoginProps> = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    
    const [loginForm, setLoginForm] = useState({
        email:'',
        password:''
    });
    
    const [formError, setFormError] = useState("");
    
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
    
    //Firebase
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formError) setFormError("");
        if (!loginForm.email.includes("@")) {
          return setFormError("Please enter a valid email");
        }
    
        // Valid form inputs
        signInWithEmailAndPassword(loginForm.email, loginForm.password);
      };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //Update form state when there are changes in inputs
        setLoginForm(prev => ({
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
            <Text textAlign="center" mt={2} fontSize="10pt" color="red">
                {formError ||
                FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text> 
            <Button 
                width="100%"
                height="36px"
                mb={2}
                mt={2}
                type="submit"
                isLoading={loading}
            >
                Log In
            </Button>
            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                Forgot your password?
                </Text>
                <Text
                fontSize="9pt"
                color="blue.500"
                cursor="pointer"
                onClick={() => 
                    setAuthModalState((prev) => ({
                        ...prev,
                        view:'resetPassword'
                    }))
                }
                >
                Reset
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>New here?</Text>
                <Text
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
                onClick={() => 
                    setAuthModalState((prev) => ({
                        ...prev,
                        view:'signup'
                    }))
                }
                >
                SIGN UP
                </Text>
            </Flex>
        </form>
      );
}
export default Login;