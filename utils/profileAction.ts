import {Dispatch, SetStateAction} from "react";
import {PasswordsUpdateState, ProfileUpdateState} from "../utils/types"
import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export const followUser = async (
  userToFollowId:string,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
):Promise<void> => {
  try {
    await axios(`${baseUrl}/api/profile/follow/${userToFollowId}`);
    if (refreshRouter) {
      refreshRouter();
    }
    if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    console.log(err);
    alert(catchErrors(err));
  }
};

export const unfollowUser = async (
  userToUnfollowId:string,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
):Promise<void>=> {
  try {
    await axios(`${baseUrl}/api/profile/unfollow/${userToUnfollowId}`);
    if (refreshRouter) {
      refreshRouter();
    }
    if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    console.log(err);
    alert(catchErrors(err));
  }
};

export const profileUpdate = async (
  profile:ProfileUpdateState,
  profilePicUrl:string,
  setError:Dispatch<SetStateAction<string>>,
  setLoading:Dispatch<SetStateAction<boolean>>,
  setToastrType:Dispatch<SetStateAction<string>>,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
):Promise<void> => {
  try {
    setLoading(true);
    const { bio, facebook, instagram, youtube, twitter } = profile;
    await axios.put(`${baseUrl}/api/profile/update`, {
      bio,
      facebook,
      instagram,
      youtube,
      twitter,
      profilePicUrl,
    });
    setLoading(false);
    setToastrType("update");
    refreshRouter();
  } catch (err) {
    setError(catchErrors(err));
    setLoading(false);
  }
};

export const passwordUpdate = async (
  currentPassword:string,
  newPassword:string,
  setPasswords:Dispatch<SetStateAction<PasswordsUpdateState>>,
  setToastrType:Dispatch<SetStateAction<string>>,
):Promise<void> => {
  try {
    await axios.put(`${baseUrl}/api/profile/setting/password`, {
      currentPassword,
      newPassword,
    });
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setToastrType("update");
  } catch (err) {
    console.log(err);
    alert(catchErrors(err));
  }
};

export const toggleMessagePopup = async (setMessagePopup, setToastrType) => {
  await axios.put(`${baseUrl}/api/profile/setting/messagepopup`);
  setMessagePopup((prev) => !prev);
  setToastrType("update");
};
