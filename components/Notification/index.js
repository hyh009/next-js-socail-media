import { useState } from "react";
import classes from "./notification.module.css";
import { Avator, CalculateTime, Button } from "../Common";
import Link from "next/link";
import Image from "next/image";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { followUser, unfollowUser } from "../../utils/profileAction";

export const CommentNotification = ({ notification }) => {
  return (
    <div className={classes.container}>
      <Avator
        src={notification.user.profilePicUrl}
        alt={notification.user.name}
        shape="circle"
      />
      <div className={classes[`left-side`]}>
        <Link href={`/${encodeURIComponent(notification.user.username)}`}>
          <a className={classes[`link-text`]}>{notification.user.name} </a>
        </Link>
        commented on your
        <Link href={`/post/${encodeURIComponent(notification.post._id)}`}>
          <a className={classes[`link-text`]}> post</a>
        </Link>
        <CalculateTime date={notification.date} />
        <p className={classes.text}>{notification.text}</p>
        {notification.post?.picUrl && (
          <div className={classes[`post-image-container`]}>
            <Image
              src={notification.post.picUrl}
              alt="post image"
              width="100%"
              height="100%"
              objectFit="cover"
              layout="responsive"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const LikeNotification = ({ notification }) => {
  return (
    <div className={classes.container}>
      <Avator
        src={notification.user.profilePicUrl}
        alt={notification.user.name}
        shape="circle"
      />
      <div className={classes[`left-side`]}>
        <Link href={`/${encodeURIComponent(notification.user.username)}`}>
          <a className={classes[`link-text`]}>{notification.user.name} </a>
        </Link>
        liked your
        <Link href={`/post/${encodeURIComponent(notification.post._id)}`}>
          <a className={classes[`link-text`]}> post</a>
        </Link>
        <CalculateTime date={notification.date} />
        {notification.post?.picUrl && (
          <div className={classes[`post-image-container`]}>
            <Image
              src={notification.post.picUrl}
              alt="post image"
              width="100%"
              height="100%"
              objectFit="cover"
              layout="responsive"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const FollowNotification = ({
  notification,
  userFollowStats,
  refreshRouter,
}) => {
  const [disable, setDisable] = useState(false);
  const isFollowing =
    userFollowStats.following.length > 0 &&
    userFollowStats.following.filter(
      (item) => item.user === notification.user._id
    ).length > 0;
  return (
    <div className={classes[`followr-container`]}>
      <div className={classes[`user-info`]}>
        <Avator
          src={notification.user.profilePicUrl}
          alt={notification.user.name}
          shape="circle"
        />
        <div>
          <Link href={`/${encodeURIComponent(notification.user.username)}`}>
            <a className={classes[`link-text`]}>{notification.user.name} </a>
          </Link>
          started following you
          <CalculateTime date={notification.date} />
        </div>
      </div>
      <Button
        icon={isFollowing ? FaUserCheck : FaUserPlus}
        look="small-button"
        isDisable={disable}
        clickHandler={
          isFollowing
            ? async () => {
                setDisable(true);
                await unfollowUser(notification.user._id, refreshRouter);
                setDisable(false);
              }
            : async () => {
                setDisable(true);
                await followUser(notification.user._id, refreshRouter);
                setDisable(false);
              }
        }
      />
    </div>
  );
};
