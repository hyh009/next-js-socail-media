import { useState, useRef } from "react";
import { IComment, IUser } from "../../../utils/types";
import { CommentUser, SmallPopup } from "../../Common";
import { AiOutlineClose } from "react-icons/ai";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import classes from "./comment.module.css";

interface Props {
  comment:IComment
  currentUser:{_id:string, role:"admin"|"user"}
  postUser:string
  deleteCommentHandler:(e:React.MouseEvent<HTMLButtonElement>, commentId:string)=>Promise<void>
}
const Comment:React.FC<Props> = ({ comment, currentUser, postUser, deleteCommentHandler }) => {
  const [showPop, setShowPop] = useState(false);
  const popRef = useRef(null);
  // click outside to close popup
  useClickOutsideClose(popRef, setShowPop);
  // only admin, comment owner, post owner can delete comment
  const showDeleteIcon =
    currentUser.role === "admin" ||
    comment.user._id === currentUser._id ||
    postUser === currentUser._id;

  return (
    <div className={`${classes.container}`}>
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
