import React, { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";
import { IPost, IUser } from "../../../utils/types";
import { Content, CommentArea } from "../index";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import classes from "./postModal.module.css";

interface PostModalProps {
  post:IPost
  user:IUser
  setShowPostModal:Dispatch<SetStateAction<boolean>>
  setShowComments:Dispatch<SetStateAction<boolean>>
  setUpdateTrue:()=>void
}

interface CloseIconProps {
  setShowPostModal:Dispatch<SetStateAction<boolean>>
}
const CloseIcon:React.FC<CloseIconProps> = ({ setShowPostModal }) => {
  return ReactDOM.createPortal(
    <AiOutlineClose
      className={classes[`close-icon`]}
      onClick={() => {
        setShowPostModal(false);
      }}
    />,
    document.getElementById("backdrop-root")
  );
};

const PostModal:React.FC<PostModalProps> = ({
  post,
  user,
  setShowPostModal,
  setShowComments,
  setUpdateTrue,
}) => {
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
          propClass={post.picUrl ? "post-modal":undefined}
          setShowComments={setShowComments}
          setUpdateTrue={setUpdateTrue}
        />
        <CommentArea
          post={post}
          user={user}
          restrictHeight="180"
          propClass={post.picUrl ? "post-modal":undefined}
          setUpdateTrue={setUpdateTrue}
        />
      </div>
    </div>,
    document.getElementById("backdrop-root")
  );
};

export default PostModal;
