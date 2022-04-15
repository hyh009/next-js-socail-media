import React from "react";
import ReactDOM from "react-dom";
import classes from "./postModal.module.css";
import { Content, CommentArea } from "../index";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

const CloseIcon = ({ setShowPostModal }) => {
  return ReactDOM.createPortal(
    <AiOutlineClose
      className={classes[`close-icon`]}
      onClick={(e) => {
        setShowPostModal(false);
      }}
    />,
    document.getElementById("backdrop-root")
  );
};

const PostModal = ({ post, user, setShowPostModal, setShowComments }) => {
  return ReactDOM.createPortal(
    <div
      className={`${
        post.picUrl ? classes.container : classes[`textonly-container`]
      }`}
    >
      <CloseIcon setShowPostModal={setShowPostModal} />
      {post.picUrl && (
        <div className={classes[`image-container`]}>
          <Image
            alt={post.text}
            src={post.picUrl}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        </div>
      )}
      <div
        className={`${classes.postContainer} ${
          post.picUrl && classes[`tablet-postContainer`]
        }`}
      >
        <Content
          showImage={false}
          post={post}
          user={user}
          propClass={post.picUrl && "post-modal"}
          setShowComments={setShowComments}
        />
        <CommentArea
          post={post}
          user={user}
          restrictHeight="180"
          propClass={post.picUrl && "post-modal"}
        />
      </div>
    </div>,
    document.getElementById("backdrop-root")
  );
};

export default PostModal;
