import React from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Flex, Icon, Menu,
    MenuButton, MenuList, Text, Image
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TiHome } from "react-icons/ti";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import Communities from "./Communities";
import useDirectory from "../../../hooks/useDirectory";
import useCommunityData from '../../../hooks/useCommunityData';

// import NoUserList from "./NoUserlist";
// import UserList from "./UserList";

const Directory: React.FC = () => {
  const [authModal, setModalState] = useRecoilState(authModalState);
  const [user] = useAuthState(auth);

  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4px"
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
        overflow="hidden" 
        textOverflow="ellipsis"
      >
        <Flex 
            alignItems="center"
            justifyContent="space-between"
            width={{ base: "auto", lg: "200px" }}
        >
          <Flex alignItems="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image alt="Reddit Image" src={directoryState.selectedMenuItem.imageURL} borderRadius="full" boxSize="24px" mr={2} />
            ) : (
              <Icon 
                fontSize={24}  
                mr={{ base: 1, md: 2}} 
                as={directoryState.selectedMenuItem.icon}
                color={directoryState.selectedMenuItem.iconColor} 
              />
            )}
            <Flex display={{ base: 'none', lg:"flex"}} width="80%">
                <Text 
                  style={{
                    fontWeight: 600,
                    fontSize:"10pt" ,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                    {directoryState.selectedMenuItem.displayText}
                </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
