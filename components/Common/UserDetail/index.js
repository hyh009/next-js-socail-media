import { forwardRef } from "react";
import classes from "./userDetail.module.css";
import { Avator } from "../index";
import { CalculateTime } from "../index";
import Link from "next/link";

const UserLink = forwardRef(({ onClick, href, user }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref} className={classes[`user-link`]}>
      <span className={classes.username} title={user.name}>
        {user.name}
      </span>
    </a>
  );
});

UserLink.displayName = "UserLink";

const CommentUserLink = forwardRef(({ onClick, href, user }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref} className={classes[`user-link`]}>
      <span className={classes[`username-comment`]} title={user.name}>
        {user.name}
      </span>
    </a>
  );
});

CommentUserLink.displayName = "CommentUserLink";

export const PostUser = ({ user, date, location, postId }) => {
  return (
    <div className={classes.container}>
      <Avator
        src={user.profilePicUrl}
        alt={user.username}
        border={"border-light"}
        shape="circle"
      />
      <div className={classes[`user-info`]}>
        <Link href={`/${user.username}`} passHref>
          <UserLink user={user} />
        </Link>
        {location && (
          <span className={classes.location} title={location}>
            {location}
          </span>
        )}
        {date && <CalculateTime date={date} type="post" postId={postId} />}
      </div>
    </div>
  );
};

export const CommentUser = ({ user, date }) => {
  return (
    <div className={classes[`user-info-comment`]}>
      <Avator src={user.profilePicUrl} alt={user.username} size="auto" />
      <div className={classes[`text-container`]}>
        <Link href={`/${user.username}`} passHref>
          <CommentUserLink user={user} />
        </Link>
        <CalculateTime date={date} type="comment" />
      </div>
    </div>
  );
};
