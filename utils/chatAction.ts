import axios, { AxiosResponse } from "axios";
import {DisplayUser, IUser} from "./types"
import baseUrl from "./baseUrl";
import { RefObject } from "react";

export const getUserInfo = async (userToFindId:string):Promise<DisplayUser> => {
  try {
    const res:AxiosResponse<IUser> = await axios(`${baseUrl}/api/chat/user/${userToFindId}`);
    return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
  } catch (err) {
    alert("Error looking for user");
  }
};

export const scrollToBottom = (elementRef:RefObject<HTMLDivElement>):void => {
  elementRef.current !== null &&
    elementRef.current?.scrollIntoView({ behavior: "smooth" });
};
