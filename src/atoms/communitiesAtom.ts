import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";
// import { FieldValue, Timestamp } from "firebase/firestore";

//THIS IS THE CURRENT COMMUNITY PAGE
export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restrictied" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
}
//--------------------------------------------------------------------------------
//THIS IS THE CURRENT USER'S SNIPPETS OR COMMUNITIES JOINED
//Declare the values inside the CommunitySnippet ARRAY
export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}
//Initialize mySnippets with the delcared array CommunitySnippet[]
//mySnippets array values have to be declared first
interface CommunityState {
  // [key: string]:
  //   | CommunitySnippet[]
  //   | { [key: string]: Community }
  //   | Community
  //   | boolean
  //   | undefined;
  mySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  snippetsFetched: boolean;
  // visitedCommunities: {
  //   [key: string]: Community;
  // };
  
}

export const defaultCommunity = {
  id: "",
  creatorId: "",
  numberOfMembers: 0,
  privacyType: null!,
};

//initialize default values
export const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
  // visitedCommunities: {},
  currentCommunity: defaultCommunity,
};
//                ↓ Call this to setValue 
export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});