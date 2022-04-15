import { useState } from "react";
import classes from "./commentArea.module.css";
import { InputWithAvator } from "../../Form";
import { NoComment } from "../../Layout";
import { Button } from "../../Common";
import { Comment } from "../index";
import { BsFillArrowRightSquareFill, BsThreeDots } from "react-icons/bs";
import { createComment, deleteComment } from "../../../utils/postAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";

const CommentArea = ({
  post,
  user,
  setUpdateTrue, // get updated data from client side
  number, // show how many comments
  restrictHeight,
  showComments, // to set no data placeholder for modal only
  propClass, // type: comment-modal, post-modal
  popRef, // to click outside close
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  let refreshRouter;
  if (!setUpdateTrue) {
    refreshRouter = useGetDataFromServer();
  }

  if (typeof number === "undefined") number = post.comments.length;
  // handle input change
  const changeHandler = (e) => {
    setNewComment(e.target.value);
  };
  // add comment
  const addCommentHandler = async (e) => {
    e.preventDefault();
    if (newComment.trim().length === 0)
      return alert("comment must be at least 1 character");
    setLoading(true);
    await createComment(
      post._id,
      newComment.trim(),
      setNewComment,
      refreshRouter,
      setUpdateTrue
    );
    setLoading(false);
  };
  // delete comment
  const deleteCommentHandler = async (e, commentId) => {
    e.preventDefault();
    setLoading(true);
    await deleteComment(post._id, commentId, refreshRouter, setUpdateTrue);
    setLoading(false);
  };

  return (
    <div
      ref={popRef}
      className={`${
        restrictHeight && post.comments.length >= 3
          ? classes[`container-maxHeight-${restrictHeight}`]
          : classes[`container`]
      } ${classes[propClass]}`}
    >
      {/* comments area */}
      {post.comments && (
        <div className={`${classes[`comment-container`]}`}>
          {post.comments.length === 0 && showComments && <NoComment />}
          {post.comments.length > 0 &&
            post.comments
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, number)
              .map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  currentUser={{ _id: user._id, role: user.role }}
                  postUser={post.user._id}
                  deleteCommentHandler={deleteCommentHandler}
                />
              ))}
        </div>
      )}
      {/* add comment input */}
      <div className={classes[`comment-input-container`]}>
        <InputWithAvator
          type="text"
          placeholder="Add a comment"
          value={newComment}
          changeHandler={changeHandler}
          profilePicUrl={user.profilePicUrl}
          alt={user.username}
        />
        <Button
          icon={loading ? BsThreeDots : BsFillArrowRightSquareFill}
          look="icon-button"
          clickHandler={addCommentHandler}
          isDisable={newComment.trim().length === 0}
        />
      </div>
    </div>
  );
};

export default CommentArea;
