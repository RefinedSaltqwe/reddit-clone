import { atom } from "recoil";

//declare
export interface AuthModalState {
  open: boolean;
  view: ModalView;
}

export type ModalView = "login" | "signup" | "resetPassword";
// default values
const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};
//export
export const authModalState = atom<AuthModalState>({
  key: "authModalState", // this is just a unique identifier requried by recoil
  default: defaultModalState,
});
