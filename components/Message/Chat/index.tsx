import React,{RefObject} from "react";
import {DisplayUser, DisplayMessage} from "../../../utils/types"
import { Avator, CalculateTime } from "../../Common";
import { MdOutlineDeleteForever } from "react-icons/md";
import classes from "./chat.module.css";


interface Props {
  message:DisplayMessage
  isCurrentUserSender:boolean
  senderInfo:DisplayUser
  newMessageRef:RefObject<HTMLDivElement>
  enableDeleteMsg:boolean
  deleteMsg:(messageId:string) => void //React.MouseEventHandler<IconType>
}

const Chat:React.FC<Props> = ({
  message,
  isCurrentUserSender,
  senderInfo,
  newMessageRef,
  enableDeleteMsg,
  deleteMsg
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
