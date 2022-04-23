import { useState, useRef, useEffect, useCallback,type Dispatch, SetStateAction, ReactElement } from "react";
import { requireAuthentication } from "../utils/HOC/redirectDependonAuth";
import type { GetServerSidePropsContext,NextLayoutComponentType } from 'next';
import axios,{ type AxiosResponse} from "axios";
import baseUrl from "../utils/baseUrl";
import Head from "next/head";
import socketEvent from "../utils/socketEvent";
import { getUserInfo } from "../utils/chatAction";
import { usePlayAudio, useChangeTitle } from "../utils/hooks/useNotification";
import { useSocket, useSocketNotifyPostLiked } from "../utils/hooks/useSocket";
import { MessageLayout } from "../components/Layout";
import { ChatOverview, ChatRoom } from "../components/Message";
import { NotificationPopup } from "../components/Notification";
import { PAGE_TITLE } from "../utils/headContent";
import {type IChat, IUser,ConnectedUserState, IMessage,CurrentChatWithState,IUserFollowStats } from "../utils/types";


interface Props {
  user:IUser
  chats:IChat[]
  setNotificationUnread:Dispatch<SetStateAction<boolean>>
}

const Message:NextLayoutComponentType<Props> = ({ user, chats, setNotificationUnread }) => {
  const [connectedUsers, setConnectedUsers] = useState<Array<ConnectedUserState>>([]); // online userlist
  const [loggedChats, setLoggedChats] = useState<Array<IChat>>(chats);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [currentChatWith, setCurrentChatWith] = useState<CurrentChatWithState>(null);
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [pageTitle, changeTitle] = useChangeTitle(PAGE_TITLE.MESSAGE); //page title
  const openChatUser = useRef<CurrentChatWithState>(null); // for getting updated data from socket.on event handler
  const chatsRef = useRef<Array<IChat>>(null); // for getting updated data from socket.on event handler
  const newMessageRef = useRef<HTMLDivElement>(null); // for scroll to bottom
  const chatWindowRef = useRef<HTMLDivElement>(null); // prevent dragable icon outside chat window
  openChatUser.current = currentChatWith;
  chatsRef.current = loggedChats;
  // audio notification
  const { startPlaying } = usePlayAudio("/light.mp3");
  // create socket connection
  const socket = useSocket(user, setConnectedUsers);
  // post liked notification setting
  const [newNotification, showNotificationPopup, closeNotificationPopup] =
    useSocketNotifyPostLiked(setNotificationUnread);

  // to update message when msg was deleted
  const updatedDeletedMsg = useCallback((msgId) => {
    setMessages((prev) =>
      prev.map((msgItem) => {
        if (msgId === msgItem._id) {
          return { ...msgItem, msg: "**This message was deleted**" };
        } else {
          return msgItem;
        }
      })
    );
  }, []);
  // to update chat when deleted msg is lastMessage
  const updatedChatsIfMsgDeleted = useCallback(
    (messagesWith:string =null) => {
      if (messagesWith === null) {
        messagesWith = currentChatWith.messagesWith;
      }

      setLoggedChats((prev) =>
        prev.map((chat) =>
          chat.messagesWith === messagesWith
            ? {
                ...chat,
                lastMessage: "**This message was deleted**",
              }
            : chat
        )
      );
    },
    [currentChatWith]
  );

  // socket on listener: MESSAGE_SAVE_AND_SENT
  const saveAndSentMsgListener = useCallback(async (args:{newMsg:IMessage}):Promise<void> => {
    // add messages from you own to chat window (if window is open)
    const { newMsg } = args;
    if (
      openChatUser.current !== null &&
      newMsg.receiver === openChatUser.current.messagesWith
    ) {
      setMessages((prev) => [...prev, newMsg]);
      // check chat exist or not
      const previousChatExist =
        chatsRef.current.filter((chat) => chat.messagesWith === newMsg.receiver)
          .length > 0;
      // if exist => update last message & date in chatlist
      if (previousChatExist) {
        setLoggedChats((prev) => {
          return prev.map((chat) => {
            if (chat.messagesWith === newMsg.receiver) {
              return {
                ...chat,
                lastMessage: newMsg.msg,
                date: newMsg.date,
              };
            } else {
              return chat;
            }
          });
        });
      } else {
        // not exist => create new chat object
        const newChat = {
          messagesWith: newMsg.receiver,
          name: openChatUser.current.name,
          profilePicUrl: openChatUser.current.profilePicUrl,
          lastMessage: newMsg.msg,
          date: newMsg.date,
        };
        setLoggedChats((prev) => [newChat, ...prev]);
      }
    }
  }, []);

  // socket on listener: MESSAGE_RECEIVED
  const receiveMsgListener = useCallback(
    async (args:{newMsg:IMessage}):Promise<void> => {
      const { newMsg } = args;
      let senderName:string; // for notification (change page title)
      // add messages from messagesWith user (if window is open)
      if (
        openChatUser.current !== null &&
        newMsg.sender === openChatUser.current.messagesWith
      ) {
        setMessages((prev) => [...prev, newMsg]);
        // update last message & date in chatlist & set sender name
        setLoggedChats((prev) => {
          return prev.map((chat) => {
            if (chat.messagesWith === newMsg.sender) {
              senderName = chat.name;
              return { ...chat, lastMessage: newMsg.msg, date: newMsg.date };
            } else {
              return chat;
            }
          });
        });
      } else {
        // if chat window is not open, check chat exist or not
        const previousChatExist =
          chatsRef.current.filter((chat) => chat.messagesWith === newMsg.sender)
            .length > 0;
        // if chat already exist, just update chatlist
        if (previousChatExist) {
          setLoggedChats((prev) => {
            return prev.map((chat) => {
              if (chat.messagesWith === newMsg.sender) {
                senderName = chat.name;
                return {
                  ...chat,
                  lastMessage: newMsg.msg,
                  date: newMsg.date,
                };
              } else {
                return chat;
              }
            });
          });
        } else {
          // if chat not exist, create new chat object
          const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
          const newChat = {
            messagesWith: newMsg.sender,
            name,
            profilePicUrl,
            lastMessage: newMsg.msg,
            date: newMsg.date,
          };
          senderName = name;
          setLoggedChats((prev) => [newChat, ...prev]);
        }
      }
      // notification
      if (
        openChatUser.current === null ||
        openChatUser.current.messagesWith !== newMsg.sender
      ) {
        startPlaying(); // play audio
        changeTitle(`New message from ${senderName}`); //change page title to notify user
      }
    },
    [startPlaying, changeTitle]
  );

  // socket on listener: MESSAGE_DELETE_UPDATE
  const changeDeletedMsgListener = useCallback(
    async (args:{messagesWith:string,msgId:string,isLastMsg:boolean}):Promise<void> => {
      const { messagesWith, msgId, isLastMsg } = args;
      // if user's currentChatWith user ===  messagesWith user and messagesWith user delete a msg
      if (messagesWith === openChatUser.current?.messagesWith) {
        updatedDeletedMsg(msgId);
        if (isLastMsg) {
          updatedChatsIfMsgDeleted(messagesWith);
        }
      } else {
        if (isLastMsg) {
          updatedChatsIfMsgDeleted(messagesWith);
        }
      }
    },
    [updatedChatsIfMsgDeleted, updatedDeletedMsg]
  );

  // socket event => handle load history messages
  useEffect(() => {
    // get chat room messages
    const loadMessages = () => {
      socket.emit(socketEvent.MESSAGES_GET, {
        userId: user._id,
        messagesWith: currentChatWith.messagesWith,
      });
      setMessagesLoading(true);
      socket.on(socketEvent.MESSAGES_LOADED, ({ chat }) => {
        if (chat) {
          setMessages(chat);
        } else {
          setMessages([]);
        }
        setMessagesLoading(false);
      });
    };
    if (socket && currentChatWith !== null) {
      loadMessages();
    }
  }, [currentChatWith, user._id, socket]);

  // socket event => hanlde sent & receive & change deleted newMsg
  useEffect(() => {
    if (socket) {
      if (openChatUser.current !== null) {
        // (for message sender) after sent message, we will get newMsg by this socket event
        socket.on(socketEvent.MESSAGE_SAVE_AND_SENT, saveAndSentMsgListener);
      }

      // (for message receiver) only get newMsg when current user === messagesWith user & receiver
      socket.on(socketEvent.MESSAGE_RECEIVED, receiveMsgListener);

      // (for message receiver) handle message deleted
      socket.on(socketEvent.MESSAGE_DELETE_UPDATE, changeDeletedMsgListener);
    }
    return () => {
      // prevent duplicate message after currentChatwith changed
      socket &&
        socket.off(socketEvent.MESSAGE_SAVE_AND_SENT, saveAndSentMsgListener);

      socket && socket.off(socketEvent.MESSAGE_RECEIVED, receiveMsgListener);

      socket &&
        socket.off(socketEvent.MESSAGE_DELETE_UPDATE, changeDeletedMsgListener);
    };
  }, [
    saveAndSentMsgListener,
    receiveMsgListener,
    currentChatWith,
    changeDeletedMsgListener,
    socket,
  ]);

  // input submit event => send message
  const sendMsg = (msg:string):void => {
    if (typeof currentChatWith === null || msg.length === 0) {
      return;
    }
    if (socket) {
      socket.emit(socketEvent.MESSAGE_SEND, {
        userId: user._id,
        messagesWith: currentChatWith.messagesWith,
        msg,
      });
    }
  };
  // delete icon onclick event => delete message
  const deleteMsg = (msgId:string):void => {
    if (socket) {
      socket.emit(socketEvent.MESSAGE_DELETE, {
        userId: user._id,
        messagesWith: currentChatWith.messagesWith,
        msgId,
      });
      socket.once(
        socketEvent.MESSAGE_DELETED_RESULT,
        ({ success, error, isLastMsg }) => {
          if (success) {
            updatedDeletedMsg(msgId);
            // if updated msg is lastMessage => need to update loggedchats
            if (isLastMsg) {
              updatedChatsIfMsgDeleted();
            }
          } else if (error) {
            alert(error);
          }
        }
      );
    }
  };
  // delete chat
  const deleteChat = async (messagesWith:string):Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/api/chat/${messagesWith}`);
      setLoggedChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      setCurrentChatWith(null);
    } catch (err) {
      alert("Error occurs while deleting chat");
    }
  };
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {showNotificationPopup && (
        <NotificationPopup
          newNotification={newNotification}
          closeNotificationPopup={closeNotificationPopup}
        />
      )}
      <ChatOverview
        loggedChats={loggedChats}
        currentChatWith={currentChatWith}
        setCurrentChatWith={setCurrentChatWith}
        userId={user._id}
        connectedUsers={connectedUsers} // current online users list
        deleteChat={deleteChat}
        chatWindowRef={chatWindowRef}
      />

      <ChatRoom
        user={user}
        currentChatWith={currentChatWith}
        setCurrentChatWith={setCurrentChatWith}
        messages={messages}
        sendMsg={sendMsg}
        newMessageRef={newMessageRef}
        messagesLoading={messagesLoading}
        deleteMsg={deleteMsg}
        chatWindowRef={chatWindowRef}
      />
    </>
  );
};

export const getServerSideProps = requireAuthentication(
  async (context:GetServerSidePropsContext, 
         userRes:AxiosResponse<{user:IUser[], userFollowStats:IUserFollowStats}>) => {
    try {
      const chatRes:AxiosResponse<{chatsToBeSent:IChat[]}> = await axios(`${baseUrl}/api/chat`, {
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      return {
        props: {
          user: userRes.data.user,
          chats: chatRes.data.chatsToBeSent,
        },
      };
    } catch (error) {
      console.log(error);
      return { props: { errorCode: error.response?.status || 500 } };
    }
  }
);

export default Message;

Message.getLayout = function PageLayout(page:ReactElement) {
  const { props } = page;
  return (
    <MessageLayout
      user={props.user}
      setNotificationUnread={props.setNotificationUnread}
      notificationUnread={props.notificationUnread}
    >
      {page}
    </MessageLayout>
  );
};
