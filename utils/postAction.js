import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export async function createPost(
  post,
  location,
  picUrl,
  setPost,
  setLocation,
  setImage,
  setToastrType,
  setShowOption,
  setErrorMsg,
  refreshRouter = null,
  setUpdateTrue = null
) {
  try {
    await axios.post(`${baseUrl}/api/post/`, { ...post, picUrl, location }); // return post id
    setErrorMsg("");
    setPost({ text: "" });
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
  postId,
  setToastrType,
  refreshRouter = null,
  setUpdateTrue = null
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
  postId,
  mode,
  refreshRouter = null,
  setUpdateTrue = null
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
  postId,
  text,
  setText,
  refreshRouter = null,
  setUpdateTrue = null
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
  postId,
  commentId,
  refreshRouter = null,
  setUpdateTrue = null
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
