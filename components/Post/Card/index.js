import { useState, useRef } from "react";
import classes from "./card.module.css";
import { Content, CommentArea, PostModal, CommentModal } from "../index";
import { Popup } from "../../Common";
import { BackDrop } from "../../Layout";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardReturn } from "react-icons/md";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import { deletePost } from "../../../utils/postAction";

const Card = ({ post, user, setToastrType, refreshRouter }) => {
  const [loading, setLoading] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const popRef = useRef(null);
  const commentpopRef = useRef(null);

  // click outside to close popup
  useClickOutsideClose(popRef, setShowPop);
  useClickOutsideClose(commentpopRef, setShowComments);

  // delete a post
  const handleDeletePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deletePost(post._id, setToastrType, refreshRouter);
    setLoading(false);
  };

  return (
    <>
      {(loading || showPostModal || showComments) && <BackDrop />}
      {showPostModal && (
        <PostModal
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          setShowPostModal={setShowPostModal}
          setShowComments={setShowComments}
        />
      )}
      {showComments && (
        <CommentArea
          propClass="comment-modal"
          post={post}
          user={user}
          showComments={showComments}
          refreshRouter={refreshRouter}
          popRef={commentpopRef}
        />
      )}
      <div className={classes.container}>
        {
          // change icon & show delete button popup
          (user._id === post.user._id || user.role === "admin") && showPop && (
            <>
              <Popup popRef={popRef} clickHandler={handleDeletePost} />
              <MdKeyboardReturn
                className={classes[`icon-delete`]}
                onClick={() => {
                  setShowPop(false);
                }}
              />
            </>
          )
        }
        {(user._id === post.user._id || user.role === "admin") && !showPop && (
          <AiOutlineClose
            className={classes[`icon-delete`]}
            onClick={() => {
              setShowPop(true);
            }}
          />
        )}
        <Content
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          setLoading={setLoading}
          showImage={true}
          setShowPostModal={setShowPostModal}
          setShowComments={setShowComments}
        />
        <CommentArea
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          number={showComments ? undefined : 3}
          setShowComments={setShowComments}
        />
      </div>
    </>
  );
};

export default Card;
