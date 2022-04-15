import axios from "axios";
import baseUrl from "./baseUrl";

export const getUserInfo = async (userToFindId) => {
  try {
    const res = await axios(`${baseUrl}/api/chat/user/${userToFindId}`);
    return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
  } catch (err) {
    alert("Error looking for user");
  }
};

export const scrollToBottom = (elementRef) => {
  elementRef.current !== null &&
    elementRef.current?.scrollIntoView({ behaviour: "smooth" });
};
