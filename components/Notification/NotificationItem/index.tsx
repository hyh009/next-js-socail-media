import React,{ useState } from "react";
import { IUserFollowStats,NotifyFollowRelatedState,NotifyPostRelatedState} from "../../../utils/types";
import { Avator, CalculateTime, Button } from "../../Common";
import Link from "next/link";
import Image from "next/image";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { followUser, unfollowUser } from "../../../utils/profileAction";
import { useGetDataFromServer } from "../../../utils/hooks";
import classes from "./notification.module.css";

interface PostRelatedProps {
  notification: NotifyPostRelatedState
}

interface FollowRelatedProps {
  notification: NotifyFollowRelatedState
  userFollowStats:IUserFollowStats
}
export const CommentNotification:React.FC<PostRelatedProps> = ({ notification }) => {
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

export const LikeNotification:React.FC<PostRelatedProps> = ({ notification }) => {
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

export const FollowNotification:React.FC<FollowRelatedProps> = ({ notification, userFollowStats }) => {
  const [disable, setDisable] = useState<boolean>(false);

  const refreshRouter = useGetDataFromServer();
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
        <div className={classes[`follower-content`]}>
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
            ? async ():Promise<void> => {
                setDisable(true);
                await unfollowUser(notification.user._id, refreshRouter);
                setDisable(false);
              }
            : async ():Promise<void> => {
                setDisable(true);
                await followUser(notification.user._id, refreshRouter);
                setDisable(false);
              }
        }
      />
    </div>
  );
};
