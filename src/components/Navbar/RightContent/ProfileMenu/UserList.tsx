import { Box, MenuDivider } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoVideocamOutline
} from "react-icons/io5";
import { MdOutlineLogin } from "react-icons/md";
import { useSetRecoilState } from "recoil";
import { communityState } from "../../../../atoms/communitiesAtom";
import { auth } from "../../../../firebase/clientApp";
import MenuItemComponent from "../../../Layout/MenuItemComponent";

type UserListProps = {};

const UserList: React.FC<UserListProps> = () => {
  const  setCommunityStateValue  = useSetRecoilState(communityState);

  const logout = async () => {

    await signOut(auth);
    // resetCommunityState(); 
  };

  return (
    <>
      <MenuItemComponent text="Profile" icon={CgProfile} isLogout={false} logoutWrapper={logout} />
      <Box display={{ base: "", md: "none" }}>
        <MenuItemComponent text="Text" icon={BsArrowUpRightCircle} isLogout={false} logoutWrapper={logout} />
        <MenuItemComponent text="Text" icon={IoFilterCircleOutline} isLogout={false} logoutWrapper={logout} />
        <MenuItemComponent text="Text" icon={IoVideocamOutline} isLogout={false} logoutWrapper={logout} />
        <MenuItemComponent text="Text" icon={GrAdd} isLogout={false} logoutWrapper={logout} />
      </Box>
      <MenuDivider />
      <MenuItemComponent text="Logout" icon={MdOutlineLogin} isLogout={true} logoutWrapper={logout} />
    </>
  );
};
export default UserList;
