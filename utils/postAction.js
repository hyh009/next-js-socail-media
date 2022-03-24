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
  refreshRouter
) {
  try {
    await axios.post(`${baseUrl}/post/`, { ...post, picUrl, location }); // return post id
    setErrorMsg("");
    setPost({ text: "" });
    setLocation("");
    setImage("");
    setToastrType("create");
    setShowOption(false);
    refreshRouter();
  } catch (err) {
    setErrorMsg(catchErrors(err));
  }
}

export async function deletePost(postId, setToastrType, refreshRouter) {
  try {
    await axios.delete(`${baseUrl}/post/${postId}`); // return message
    setToastrType("delete");
    refreshRouter();
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function toggleLikePost(postId, mode, refreshRouter) {
  try {
    if (mode === "like") {
      await axios.put(`${baseUrl}/post/like/${postId}`);
    } else if (mode === "unlike") {
      await axios.put(`${baseUrl}/post/unlike/${postId}`);
    }
    refreshRouter();
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function createComment(postId, text, setText, refreshRouter) {
  try {
    await axios.put(`${baseUrl}/post/comment/${postId}`, { text });
    setText("");
    refreshRouter();
  } catch (err) {
    alert(catchErrors(err));
  }
}

export async function deleteComment(postId, commentId, refreshRouter) {
  try {
    await axios.delete(`${baseUrl}/post/${[postId]}/${commentId}`);
    refreshRouter();
  } catch (err) {
    catchErrors(err);
  }
}
