
import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthModal from '../../Modal/Auth';
import AuthButtons from './AuthButtons';
import Icons from './Icons';
import UserMenu from './ProfileMenu/UserMenu';

type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = ({ user }) => { //or ({ props }) call props.user
    
    return (
        <>
            <AuthModal />
            <Flex justifyContent="space-between" alignItems="center">
                {user ? (
                    <Icons/>
                ) : (
                    <AuthButtons />
                )}
                <UserMenu user={user} />
            </Flex>
        </>
    )
}
export default RightContent;