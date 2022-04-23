import { useEffect, useState, useCallback,Dispatch,SetStateAction } from "react";
import { type IUser,IMessage,NewReceivedMsgState, NewNotificationState} from "../types";
import { type Socket} from "socket.io-client";
import { type ServerToClientEvents, ClientToServerEvents } from "../types/socket";
import { type usersType} from "../types/socket"
import { usePlayAudio, useChangeTitle } from "./useNotification";
import socketEvent from "../socketEvent";
import { getUserInfo } from "../chatAction";
import { useSocketConnect } from "../context/SocketContext";


// create socket io client connection && get online user list
export const useSocket = (user:IUser, setConnectedUsers:Dispatch<SetStateAction<usersType>> = null):Socket<ServerToClientEvents, ClientToServerEvents> => {
  const socket = useSocketConnect(); // get socket from useContext

  useEffect(() => {
    if (socket) {
      socket.emit(socketEvent.USER_JOIN, { userId: user._id });
      socket.on(socketEvent.USERS_CONNECTED, ({ users }:{users:usersType}):void => {
        if (setConnectedUsers) {
          setConnectedUsers(users);
        }
      });
    }

    return () => {
      socket.emit(socketEvent.USER_LEAVE);
      socket.off();
    };
  }, [user._id, socket]);

  return socket;
};

type ReceiveMsgReturn = [pageTitle: string,
                         newRecievedMessage:NewReceivedMsgState,
                         showNewMessageModal:boolean,
                         setShowNewMessageModal:Dispatch<SetStateAction<boolean>> ]

export const useSocketReceiveMsg = (user:IUser, defaultTitle:string):ReceiveMsgReturn => {
  const socket = useSocketConnect();
  const [newRecievedMessage, setNewRecievedMessage] = useState<NewReceivedMsgState>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState<boolean>(false);
  const { startPlaying } = usePlayAudio("/light.mp3");
  const [pageTitle, changePageTitle] = useChangeTitle(defaultTitle);

  const newMessageReceived = useCallback(
    async (args:{newMsg:IMessage}):Promise<void> => {
      const { newMsg } = args;
      const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
      if (user.newMessagePopup) {
        setNewRecievedMessage({
          ...newMsg,
          senderName: name,
          senderProfilePic: profilePicUrl,
        });
        setShowNewMessageModal(true);
        // notification
        startPlaying();
        changePageTitle(`New message from ${name}`);
      }
    },
    [user]
  );

  useEffect(() => {
    if (socket) {
      socket.on(socketEvent.MESSAGE_RECEIVED, newMessageReceived);
    }

    return () => {
      socket && socket.off(socketEvent.MESSAGE_RECEIVED, newMessageReceived);
    };
  }, [user, socket]);

  return [
    pageTitle,
    newRecievedMessage,
    showNewMessageModal,
    setShowNewMessageModal,
  ];
};

type NotifyPostLikedReturn = [newNotification:NewNotificationState, 
                              showNotificationPopup:boolean,
                              closeNotificationPopup:()=>void]

export const useSocketNotifyPostLiked = (setNotificationUnread:Dispatch<SetStateAction<boolean>>):NotifyPostLikedReturn => {
  const [newNotification, setNewNotification] = useState<NewNotificationState>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const closeNotificationPopup = ():void => setShowNotificationPopup(false);

  const postLikedNotifyHandler = useCallback(
    ({ name, profilePicUrl, username, postId, postPic }:NewNotificationState) => {
      setNewNotification({
        name,
        profilePicUrl,
        username,
        postId,
        postPic,
      });
      setShowNotificationPopup(true);
      setNotificationUnread(true);
    },
    []
  );

  const socket = useSocketConnect();
  useEffect(() => {
    if (socket) {
      socket.on(socketEvent.POST_LIKED_NOTIFY, postLikedNotifyHandler);
    }
    return () => {
      socket.off(socketEvent.POST_LIKED_NOTIFY, postLikedNotifyHandler);
    };
  }, []);
  //close notification after 5s
  useEffect(() => {
    let timer:any;
    if (showNotificationPopup) {
      setTimeout(closeNotificationPopup, 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [showNotificationPopup]);
  return [newNotification, showNotificationPopup, closeNotificationPopup];
};
