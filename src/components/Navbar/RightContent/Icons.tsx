import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";

import RightNavbarContentIcon from "../../Layout/RightNavbarContentIcon";
// import useDirectory from "../../../hooks/useDirectory";

type IconsProps = {};

const Icons: React.FC<IconsProps> = () => {
//   const { toggleMenuOpen } = useDirectory();
  return (
    <Flex alignItems="center" flexGrow={1}>
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <RightNavbarContentIcon 
          mr={1.5} ml={1.5} 
          padding={1} 
          cursor="pointer" 
          borderRadius={4} 
          icon={BsArrowUpRightCircle} 
          fontSize={20}
        />
        <RightNavbarContentIcon 
          mr={1.5} ml={1.5} 
          padding={1} 
          cursor="pointer" 
          borderRadius={4} 
          icon={IoFilterCircleOutline} 
          fontSize={22}
        />
        <RightNavbarContentIcon 
          mr={1.5} ml={1.5} 
          padding={1} 
          cursor="pointer" 
          borderRadius={4} 
          icon={IoVideocamOutline} 
          fontSize={22}
        />
      </Box>
      <>
        <RightNavbarContentIcon 
          mr={1.5} ml={1.5} 
          padding={1} 
          cursor="pointer" 
          borderRadius={4} 
          icon={BsChatDots} 
          fontSize={20}
        />
        <RightNavbarContentIcon 
          mr={1.5} ml={1.5} 
          padding={1} 
          cursor="pointer" 
          borderRadius={4} 
          icon={IoNotificationsOutline} 
          fontSize={20}
        />
        <Flex
          display={{ base: "none", md: "flex" }}
          mr={3}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        //   onClick={toggleMenuOpen}
        >
          <Icon as={GrAdd} fontSize={20} />
        </Flex>
      </>
    </Flex>
  );
};
export default Icons;
