import { atom } from "recoil";

export const readyState = atom({
  key: "readyState",
  default: false
});
