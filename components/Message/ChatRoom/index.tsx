import { useState, useEffect, Dispatch, SetStateAction, RefObject } from "react";
import {IUser, DisplayUser, IMessage, CurrentChatWithState} from "../../../utils/types"
import Image from "next/image";
import { scrollToBottom } from "../../../utils/chatAction";
import { InputWithAvator } from "../../Form";
import { Avator, Button } from "../../Common";
import { DivSpinner } from "../../Layout";
import { Chat } from "../index";
import { AiOutlineClose } from "react-icons/ai";
import { RiChatDeleteFill } from "react-icons/ri";
import { BsArrowRepeat } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import classes from "./chatRoom.module.css";
interface Props {
  user:IUser
  currentChatWith:CurrentChatWithState
  setCurrentChatWith:Dispatch<SetStateAction<CurrentChatWithState>>
  messages:IMessage[]
  sendMsg:(msg:string)=>void
  newMessageRef:RefObject<HTMLDivElement>
  messagesLoading:boolean
  deleteMsg:(messageId:string) => void
  chatWindowRef:RefObject<HTMLDivElement>
}
const ChatRoom:React.FC<Props> = ({
  user,
  currentChatWith,
  setCurrentChatWith,
  messages,
  sendMsg,
  newMessageRef,
  messagesLoading,
  deleteMsg,
  chatWindowRef,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [enableDeleteMsg, setEnableDeleteMsg] = useState<boolean>(false);
  const isCurrentUserSender = (senderId:string):boolean => senderId === user._id;

  useEffect(() => {
    if (!messagesLoading) {
      if ((newMessageRef.current !== null) && (messages.length > 0)) {
        scrollToBottom(newMessageRef);
      }
    }
  }, [messages, newMessageRef, messagesLoading]);

  useEffect(() => {
    setEnableDeleteMsg(false);
  }, []);

  return (
    <>
      {currentChatWith && (
        <div className={`${classes.container}`} ref={chatWindowRef}>
          <div className={classes[`chat-header`]}>
            <Avator
              src={currentChatWith.profilePicUrl}
              alt={currentChatWith.name}
              shape="circle"
            />
            <span>{currentChatWith.name}</span>
            {!enableDeleteMsg && (
              <RiChatDeleteFill
                className={classes[`delete-msg-icon`]}
                title="enable delete message"
                onClick={() => {
                  setEnableDeleteMsg(() => true);
                }}
              />
            )}
            {enableDeleteMsg && (
              <BsArrowRepeat
                className={classes[`delete-msg-icon`]}
                onClick={() => {
                  setEnableDeleteMsg(() => false);
                }}
              />
            )}
            <AiOutlineClose
              className={classes[`close-icon`]}
              onClick={() => {
                setCurrentChatWith(null);
              }}
            />
          </div>
          <div className={classes[`chat-window`]}>
            {messagesLoading && <DivSpinner />}
            {!messagesLoading &&
              messages.length > 0 &&
              messages.map((message, index) => {
                return (
                  <Chat
                    key={index}
                    message={{_id:message._id,msg:message.msg,date:message.date}}
                    isCurrentUserSender={isCurrentUserSender(message.sender)}
                    senderInfo={
                      isCurrentUserSender(message.sender)
                        ? {name:user.name, profilePicUrl:user.profilePicUrl}
                        : {name:currentChatWith.name, profilePicUrl:currentChatWith.profilePicUrl}
                    }
                    newMessageRef={newMessageRef}
                    enableDeleteMsg={enableDeleteMsg}
                    deleteMsg={deleteMsg}
                  />
                );
              })}
          </div>
          <form
            className={classes[`chat-input`]}
            onSubmit={(e) => {
              e.preventDefault();
              sendMsg(inputText);
              setInputText("");
            }}
          >
            <InputWithAvator
              type="text"
              name="message"
              profilePicUrl={user.profilePicUrl}
              alt={user.name}
              placeholder="Type your message here"
              value={inputText}
              changeHandler={(e) => {
                setInputText(() => e.target.value);
              }}
            />
            <Button icon={MdSend} type="submit" look="icon-button" />
          </form>
        </div>
      )}
      {
        // default image
        !currentChatWith && (
          <div
            className={classes[`no-currentchat-container`]}
            ref={chatWindowRef}
          >
            <span className={classes.title}>Message</span>
            <div className={classes[`image-container`]}>
              <Image
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
                src="https://res.cloudinary.com/dh2splieo/image/upload/v1649334555/social_media/undraw_real_time_collaboration_c62i_amecmv.svg"
                alt="message"
                priority={true}
              />
            </div>
          </div>
        )
      }
    </>
  );
};

export default ChatRoom;
