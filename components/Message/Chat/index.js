import React from "react";
import { Avator, CalculateTime } from "../../Common";
import { MdOutlineDeleteForever } from "react-icons/md";
import classes from "./chat.module.css";

const Chat = ({
  message,
  isCurrentUserSender,
  senderInfo,
  newMessageRef,
  enableDeleteMsg,
  deleteMsg,
}) => {
  const messageDeleted = message.msg === "**This message was deleted**";

  return (
    <div
      className={`${classes.container} ${
        isCurrentUserSender && classes.sender
      }`}
      ref={newMessageRef}
    >
      <Avator
        src={senderInfo.profilePicUrl}
        alt={senderInfo.name}
        size="small"
        shape="circle"
      />
      <div
        className={`${classes[`message-content`]} ${
          isCurrentUserSender && classes[`sender-message-content`]
        }`}
      >
        <span
          className={`${classes[`message-text`]} ${
            messageDeleted && classes[`message-text-deleted`]
          }`}
        >
          {!messageDeleted ? message.msg : "This message was deleted"}
        </span>
        <span className={classes[`message-date`]}>
          <CalculateTime date={message.date} msg={true} />
        </span>
        {enableDeleteMsg && isCurrentUserSender && !messageDeleted && (
          <MdOutlineDeleteForever
            className={classes[`icon-delete`]}
            onClick={() => {
              deleteMsg(message._id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
