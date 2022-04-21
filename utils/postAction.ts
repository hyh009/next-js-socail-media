import {Dispatch,SetStateAction} from "react";
import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export async function createPost(
  newPostText:string,
  location:string,
  picUrl:string,
  setNewPostText:Dispatch<SetStateAction<string>>,
  setLocation:Dispatch<SetStateAction<string>>,
  setImage:Dispatch<SetStateAction<string>>,
  setToastrType:Dispatch<SetStateAction<string>>,
  setShowOption:Dispatch<SetStateAction<boolean>>,
  setErrorMsg:Dispatch<SetStateAction<string>>,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
) {
  try {
    await axios.post(`${baseUrl}/api/post/`, { text:newPostText, picUrl, location }); // return post id
    setErrorMsg("");
    setNewPostText("");
    setLocation("");
    setImage("");
    setToastrType("create");
    setShowOption(false);
    if (refreshRouter) {
      refreshRouter();
    } else if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    setErrorMsg(catchErrors(err));
  }
}

export async function deletePost(
  postId:string,
  setToastrType:Dispatch<SetStateAction<string>>,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
) {
  try {
    await axios.delete(`${baseUrl}/api/post/${postId}`); // return message
    setToastrType("delete");
    if (refreshRouter) {
      refreshRouter();
    } else if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function toggleLikePost(
  postId:string,
  mode:"like"|"unlike",
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
) {
  try {
    if (mode === "like") {
      await axios.put(`${baseUrl}/api/post/like/${postId}`);
    } else if (mode === "unlike") {
      await axios.put(`${baseUrl}/api/post/unlike/${postId}`);
    }
    if (refreshRouter) {
      refreshRouter();
    } else if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function createComment(
  postId:string,
  text:string,
  setText:Dispatch<SetStateAction<string>>,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
) {
  try {
    await axios.put(`${baseUrl}/api/post/comment/${postId}`, { text });
    setText("");
    if (refreshRouter) {
      refreshRouter();
    } else if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function deleteComment(
  postId:string,
  commentId:string,
  refreshRouter:null | (()=> Promise<boolean>) = null ,
  setUpdateTrue:null | (()=>void ) = null
) {
  try {
    await axios.delete(`${baseUrl}/api/post/${[postId]}/${commentId}`);
    if (refreshRouter) {
      refreshRouter();
    } else if (setUpdateTrue) {
      setUpdateTrue();
    }
  } catch (err) {
    catchErrors(err);
  }
}
