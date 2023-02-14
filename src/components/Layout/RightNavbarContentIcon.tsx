import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';

type RightNavbarContentIconProps = {
    mr: number,
    ml: number,
    padding: number,
    cursor: string,
    borderRadius: number,
    icon: typeof Icon.arguments,
    fontSize: number
};

const RightNavbarContentIcon:React.FC<RightNavbarContentIconProps> = ({
    mr, ml, padding, cursor, borderRadius, icon, fontSize
}) => {
    
    return (
        <Flex
        mr={mr}
        ml={ml}
        padding={padding}
        cursor={cursor}
        borderRadius={borderRadius}
        _hover={{ bg: "gray.200" }}
        >
            <Icon as={icon} fontSize={fontSize} />
        </Flex>
    )
}
export default RightNavbarContentIcon;