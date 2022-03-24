import React from "react";
import ReactDOM from "react-dom";
import classes from "./postModal.module.css";
import { Content, CommentArea } from "../index";

const PostModal = ({ propRef, post, user, refreshRouter }) => {
  return ReactDOM.createPortal(
    <div
      className={`${
        post.picUrl ? classes.container : classes[`textonly-container`]
      }`}
      ref={propRef}
    >
      {post.picUrl && (
        <div className={classes[`image-container`]}>
          <img className={classes.image} alt={post.text} src={post.picUrl} />
        </div>
      )}
      <div className={classes.postContainer}>
        <Content
          showImage={false}
          post={post}
          user={user}
          refreshRouter={refreshRouter}
        />
        <CommentArea
          post={post}
          user={user}
          refreshRouter={refreshRouter}
          restrictHeight={true}
        />
      </div>
    </div>,
    document.getElementById("backdrop-root")
  );
};

export default PostModal;
