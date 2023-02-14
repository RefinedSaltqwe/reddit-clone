import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import React from 'react';

type MenuItemComponentProps = {
    icon: any,
    text: string,
    isLogout: boolean,
    logoutWrapper: any
};

const MenuItemComponent:React.FC<MenuItemComponentProps> = ({icon, text, isLogout, logoutWrapper}) => {

    return (
        <>
        <MenuItem
        fontSize="10pt"
        fontWeight={700}
        _hover={{ bg: "blue.500", color: "white" }}
        onClick={isLogout ? logoutWrapper : null}
        >
            <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={icon} />
                {text}
            </Flex>
        </MenuItem>
      </>
    )
}
export default MenuItemComponent;