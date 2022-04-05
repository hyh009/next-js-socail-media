import { useState, useRef } from "react";
import Image from "next/image";
import classes from "./content.module.css";
import { PostUser } from "../../Common";
import { LikeList } from "../index";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useClickOutsideClose from "../../../utils/hooks/useClickOutsideClose";
import { toggleLikePost } from "../../../utils/postAction";

const Content = ({
  post,
  user,
  refreshRouter,
  setUpdate,
  showImage,
  setShowPostModal,
  setShowComments,
  propClass,
}) => {
  const [showLikeList, setShowLikeList] = useState(false);
  const likeListRef = useRef(null);

  useClickOutsideClose(likeListRef, setShowLikeList);
  //check if post is liked by current user
  const isLiked = () =>
    post.likes &&
    post.likes.filter((like) => like.user === user._id).length > 0;

  // toggle like post
  const handleToggleLike = async (e, mode) => {
    await toggleLikePost(post._id, mode, refreshRouter, setUpdate);
  };

  return (
    <>
      {/* post content */}
      <PostUser
        user={post.user}
        date={post.createdAt}
        location={post.location}
        postId={post._id}
      />
      <div
        className={`${classes[`text-container`]} ${
          !post?.picUrl && showImage && classes.pointer
        }`}
        onClick={!post.picUrl ? () => setShowPostModal(true) : undefined}
      >
        <span className={`${classes.text} ${classes[propClass]}`}>
          {post.text}
        </span>
      </div>
      {post?.picUrl && showImage && (
        <div className={classes[`image-container`]}>
          <Image
            src={post.picUrl}
            alt={post.text}
            width="100%"
            height="80%"
            layout="responsive"
            objectFit="cover"
            onClick={showImage ? () => setShowPostModal(true) : undefined}
          />
        </div>
      )}
      {/* like & comment icons */}
      <div className={classes[`icon-container`]}>
        <div className={classes[`icon-and-text`]}>
          {isLiked() ? (
            <AiFillHeart
              className={classes[`icon-like`]}
              title="unlike"
              onClick={(e) => {
                handleToggleLike(e, "unlike");
              }}
            />
          ) : (
            <AiOutlineHeart
              className={classes[`icon-nolike`]}
              title="like the post"
              onClick={(e) => {
                handleToggleLike(e, "like");
              }}
            />
          )}
          {post.likes.length === 0 && (
            <span className={`${classes[`icon-text`]} ${classes[propClass]}`}>
              like
            </span>
          )}
          {post.likes.length > 0 && (
            <>
              <span
                className={`${classes[`icon-text`]} ${classes[propClass]}`}
                onClick={() => setShowLikeList(true)}
              >
                {post.likes.length === 1
                  ? `1 like`
                  : `${post.likes.length} likes`}
                {
                  // click like and show people who like the post
                  showLikeList && (
                    <LikeList
                      propRef={likeListRef}
                      postId={post._id}
                      setShowLikeList={setShowLikeList}
                    />
                  )
                }
              </span>
            </>
          )}
        </div>
        <div
          className={classes[`icon-and-text`]}
          onClick={
            setShowComments ? () => setShowComments((prev) => !prev) : undefined
          }
        >
          <FaRegCommentDots
            className={classes[`icon-comment`]}
            title="show comments"
          />
          {post.comments.length === 0 && (
            <span className={`${classes[`icon-text`]} ${classes[propClass]}`}>
              comment
            </span>
          )}
          {post.comments.length > 0 && (
            <span className={`${classes[`icon-text`]} ${classes[propClass]}`}>
              {post.comments.length === 1
                ? `1 comment`
                : `${post.comments.length} comments`}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Content;
