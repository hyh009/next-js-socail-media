import { useState, useRef } from "react";
import classes from "./card.module.css";
import { Content, CommentArea, PostModal } from "../index";
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
  const popRef = useRef(null);
  const postModalRef = useRef(null);

  // click outside to close popup
  useClickOutsideClose(popRef, showPop, setShowPop);
  useClickOutsideClose(postModalRef, showPostModal, setShowPostModal);

  // delete a post
  const handleDeletePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    await deletePost(post._id, setToastrType, refreshRouter);
    setLoading(false);
  };

  return (
    <>
      {(loading || showPostModal) && <BackDrop />}
      {showPostModal && (
        <PostModal
          propRef={postModalRef}
          post={post}
          user={user}
          refreshRouter={refreshRouter}
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
        />
        <CommentArea
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          number={3}
        />
      </div>
    </>
  );
};

export default Card;
