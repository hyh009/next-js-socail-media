import { useState, useRef } from "react";
import classes from "./card.module.css";
import { Content, CommentArea, PostModal } from "../index";
import { Popup } from "../../Common";
import { BackDrop } from "../../Layout";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardReturn } from "react-icons/md";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import { deletePost } from "../../../utils/postAction";

const Card = ({ post, user, setToastrType, refreshRouter, setUpdate }) => {
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
    await deletePost(post._id, setToastrType, refreshRouter, setUpdate);
    setLoading(false);
  };

  return (
    <>
      {(loading || showPostModal || showComments) && <BackDrop />}
      {
        // post model
        showPostModal && (
          <PostModal
            post={post}
            user={user}
            refreshRouter={refreshRouter}
            setUpdate={setUpdate}
            setShowPostModal={setShowPostModal}
            setShowComments={setShowComments}
          />
        )
      }
      {
        // comment modal
        showComments && (
          <CommentArea
            propClass="comment-modal"
            post={post}
            user={user}
            showComments={showComments}
            refreshRouter={refreshRouter}
            setUpdate={setUpdate}
            popRef={commentpopRef}
          />
        )
      }
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
          setUpdate={setUpdate}
          setLoading={setLoading}
          showImage={true}
          setShowPostModal={setShowPostModal}
          setShowComments={setShowComments}
        />
        <CommentArea
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          setUpdate={setUpdate}
          number={showComments ? undefined : 3}
          setShowComments={setShowComments}
        />
      </div>
    </>
  );
};

export default Card;
