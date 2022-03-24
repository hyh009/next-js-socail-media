import React from "react";
import classes from "./userDetail.module.css";
import { Avator } from "../index";
import { CalculateTime } from "../index";

export const PostUser = ({ user, date, location }) => {
  return (
    <div className={classes.container}>
      <Avator
        src={user.profilePicUrl}
        alt={user.username}
        border={"border-light"}
        shape="circle"
      />
      <div className={classes[`user-info`]}>
        <span className={classes.username} title={user.name}>
          {user.name}
        </span>
        {location && (
          <span className={classes.location} title={location}>
            {location}
          </span>
        )}
        {date && <CalculateTime createdat={date} type="post" />}
      </div>
    </div>
  );
};

export const CommentUser = ({ user, date }) => {
  return (
    <div className={classes[`user-info-comment`]}>
      <Avator src={user.profilePicUrl} alt={user.username} size="auto" />
      <div className={classes[`text-container`]}>
        <span className={classes[`username-comment`]} title={user.name}>
          {user.name}
        </span>
        <CalculateTime createdat={date} type="comment" />
      </div>
    </div>
  );
};
