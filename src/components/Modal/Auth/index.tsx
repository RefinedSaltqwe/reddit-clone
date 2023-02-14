import { useDisclosure, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import AuthInputs from './Inputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import ResetPassword from './ResetPassword';

const AuthModal:React.FC = () => {
    
    // get the values from global state {atoms folder}. That's being set in AuthButtons.tsx
    const [modalState, setModalState] = useRecoilState(authModalState); 
    //THis will Authenticate if user is logged in
    const [user, loading, error] = useAuthState(auth);

    const handleClose = () =>
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));

    useEffect(() => {
        if (user) handleClose();
        // console.log(user)
    }, [user]); // This will trigger whenever the 'user' object changes or when there is logged in user

    return (
        <>

            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" flexDirection="column" alignItems="center">
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                        <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={6}
                    >
                        <Flex
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            width="70%"
                            >
                            {modalState.view === "login" || modalState.view === "signup" ? (
                                <>
                                    <OAuthButtons />
                                    <Text color="gray.500" fontWeight={700}>OR</Text>
                                    <AuthInputs />
                                </>
                            ):(
                                <ResetPassword /> 
                            )}
                            </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
export default AuthModal;