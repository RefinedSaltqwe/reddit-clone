import useCommunityData from '../../hooks/useCommunityData';
import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { defaultMenuItem } from '../../atoms/directoryMenuAtom';
import { auth } from '../../firebase/clientApp';
import useDirectory from '../../hooks/useDirectory';
import Directory from './Directory';
import RightContent from './RightContent';
import SearchInput from './SearchInput';


const Navbar:React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    const { onSelectMenuItem } = useDirectory();

    return (
        <Flex
            bg="white"
            height="44px"
            padding="6px 12px"
            justifyContent={{ md: "space-between" }}
        >
            <Flex 
                align="center"
                width={{ base: "40px", md: "auto" }}
                mr={{ base: 0, md: 2 }}
                cursor="pointer"
                onClick ={() => onSelectMenuItem(defaultMenuItem)}
            >
                <Image alt="Image" src="/images/redditFace.svg" height="30px" />
                <Image
                alt="Image"
                display={{ base: "none", md: "unset" }} //Media Query
                src="/images/redditText.svg"
                height="46px"
                />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    )
}
export default Navbar;