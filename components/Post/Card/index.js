import { useState, useRef } from "react";
import classes from "./card.module.css";
import { Content, CommentArea, PostModal } from "../index";
import { Popup } from "../../Common";
import { BackDrop } from "../../Layout";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardReturn } from "react-icons/md";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import { deletePost } from "../../../utils/postAction";
import { useGetDataFromServer } from "../../../utils/hooks/useUpdateData";

const Card = ({ post, user, setToastrType, setUpdateTrue, currentPage }) => {
  const [loading, setLoading] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const popRef = useRef(null);
  const commentpopRef = useRef(null);

  // click outside to close popup
  useClickOutsideClose(popRef, setShowPop);
  useClickOutsideClose(commentpopRef, setShowComments);
  const refreshRouter = useGetDataFromServer(setUpdateTrue);

  // delete a post
  const handleDeletePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deletePost(post._id, setToastrType, refreshRouter, setUpdateTrue);
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
            setShowPostModal={setShowPostModal}
            setShowComments={setShowComments}
            setUpdateTrue={setUpdateTrue}
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
            setUpdateTrue={setUpdateTrue}
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
          setUpdateTrue={setUpdateTrue}
          setLoading={setLoading}
          showImage={true}
          currentPage={currentPage}
          setShowPostModal={setShowPostModal}
          setShowComments={setShowComments}
        />
        <CommentArea
          post={post}
          user={user}
          setUpdateTrue={setUpdateTrue}
          number={showComments ? undefined : 3}
          setShowComments={setShowComments}
        />
      </div>
    </>
  );
};

export default Card;
