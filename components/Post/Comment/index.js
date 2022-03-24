import { useState, useRef } from "react";
import classes from "./comment.module.css";
import { CommentUser, SmallPopup } from "../../Common";
import { AiOutlineClose } from "react-icons/ai";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";

const Comment = ({ comment, currentUser, postUser, deleteCommentHandler }) => {
  const [showPop, setShowPop] = useState(false);
  const popRef = useRef(null);
  // click outside to close popup
  useClickOutsideClose(popRef, showPop, setShowPop);
  // only admin, comment owner, post owner can delete comment
  const showDeleteIcon =
    comment.user.role === "admin" ||
    comment.user._id === currentUser ||
    postUser === currentUser;

  return (
    <div className={classes.container}>
      {showDeleteIcon && (
        <>
          {showPop && (
            <SmallPopup
              popRef={popRef}
              clickHandler={deleteCommentHandler}
              arg={comment._id}
            />
          )}
          <AiOutlineClose
            className={classes.icon}
            onClick={() => setShowPop(true)}
          />
        </>
      )}
      <CommentUser user={comment.user} date={comment.date} />
      <span>{comment.text}</span>
    </div>
  );
};

export default Comment;
