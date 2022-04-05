import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export const followUser = async (
  userToFollowId,
  refreshRouter = null,
  setUpdate = null
) => {
  try {
    await axios(`${baseUrl}/profile/follow/${userToFollowId}`);
    if (refreshRouter) {
      refreshRouter();
    }
    if (setUpdate) {
      setUpdate(true);
    }
  } catch (err) {
    console.log(err);
    alert(catchErrors(err));
  }
};

export const unfollowUser = async (
  userToUnfollowId,
  refreshRouter = null,
  setUpdate = null
) => {
  try {
    await axios(`${baseUrl}/profile/unfollow/${userToUnfollowId}`);
    if (refreshRouter) {
      refreshRouter();
    }
    if (setUpdate) {
      setUpdate(true);
    }
  } catch (err) {
    console.log(err);
    alert(catchErrors(err));
  }
};

export const profileUpdate = async (
  profile,
  profilePicUrl,
  setError,
  setLoading,
  setToastrType,
  refreshRouter
) => {
  try {
    setLoading(true);
    const { bio, facebook, instagram, youtube, twitter } = profile;
    await axios.put(`${baseUrl}/profile/update`, {
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
  currentPassword,
  newPassword,
  setPasswords,
  setToastrType
) => {
  try {
    await axios.put(`${baseUrl}/profile/setting/password`, {
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
  await axios.put(`${baseUrl}/profile/setting/messagepopup`);
  setMessagePopup((prev) => !prev);
  setToastrType("update");
};
