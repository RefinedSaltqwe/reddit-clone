import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Community, communityState, defaultCommunity } from "../atoms/communitiesAtom";
import {
  defaultMenuItem,
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { FaReddit } from "react-icons/fa";

const useDirectory = () => {
  

  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const router = useRouter();

  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: defaultCommunity
        
    }));
    // console.log("Data:   ",directoryState.selectedMenuItem);
    router?.push(menuItem.link);

    if (directoryState.isOpen) {
      toggleMenuOpen();
    }

  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    
    const { currentCommunity } = communityStateValue;
    // console.log("currentCommunity?.id: ",currentCommunity?.id);
    
    if (currentCommunity?.id) {
      // console.log(" triggers: ", currentCommunity)
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity.imageURL,
        },
      }));
    }
  }, [communityStateValue.currentCommunity]);
  //                              ^ Used to be communityStateValue.currentCommunity!.id

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;
