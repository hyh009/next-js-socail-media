import React,{ RefObject, useState, } from "react";
import { IPost, IUser } from "../../../utils/types";
import { InputWithAvator } from "../../Form";
import { NoComment } from "../../Layout";
import { Button } from "../../Common";
import { Comment } from "../index";
import { BsFillArrowRightSquareFill, BsThreeDots } from "react-icons/bs";
import { createComment, deleteComment } from "../../../utils/postAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";
import classes from "./commentArea.module.css";
type propClass = "comment-modal" | "post-modal"
interface Props {
  post:IPost
  user:IUser
  setUpdateTrue:()=>void // get updated data from client side
  showComments?:boolean // to set no data placeholder for comment-modal only
  propClass?:propClass // type: comment-modal, post-modal
  popRef?:RefObject<HTMLDivElement> // only for comment-modal => to click outside close 
  number?:number // show how many comments
  restrictHeight?:string //"180" height in post model
}
const CommentArea:React.FC<Props> = ({
  post,
  user,
  setUpdateTrue, 
  showComments, 
  propClass, 
  popRef, 
  restrictHeight,
  number, 
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const refreshRouter = useGetDataFromServer(setUpdateTrue);
  if (typeof number === "undefined") number = post.comments.length;
  // handle input change
  const changeHandler = (e:React.ChangeEvent<HTMLInputElement>):void => {
    setNewComment(e.target.value);
  };
  // add comment
  const addCommentHandler= async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
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
  const deleteCommentHandler = async (e:React.MouseEvent<HTMLButtonElement>, commentId:string) => {
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
              .sort((a, b) => Date.parse(b.date as string) - Date.parse(a.date as string))
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
      <form className={classes[`comment-input-container`]} onSubmit={addCommentHandler}>
        <InputWithAvator
          type="text"
          name="comment"
          placeholder="Add a comment"
          value={newComment}
          changeHandler={changeHandler}
          profilePicUrl={user.profilePicUrl}
          alt={user.username}
        />
        <Button
          type="submit"
          icon={loading ? BsThreeDots : BsFillArrowRightSquareFill}
          look="icon-button"
          isDisable={newComment.trim().length === 0}
        />
      </form>
    </div>
  );
};

export default CommentArea;
