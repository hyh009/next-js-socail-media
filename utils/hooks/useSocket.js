import { useEffect, useState, useCallback } from "react";
import SocketContext from "../context/SocketContext";
import { usePlayAudio, useChangeTitle } from "./useNotification";
import socketEvent from "../socketEvent";
import { getUserInfo } from "../chatAction";
import { useSocketConnect } from "../context/SocketContext";

// create socket io client connection && get online user list
export const useSocket = (user, setConnectedUsers = null) => {
  const socket = useSocketConnect(); // get socket from useContext

  useEffect(() => {
    if (socket) {
      socket.emit(socketEvent.USER_JOIN, { userId: user._id });
      socket.on(socketEvent.USERS_CONNECTED, ({ users }) => {
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

export const useSocketReceiveMsg = (user, defaultTitle) => {
  const socket = useSocketConnect();
  const [newRecievedMessage, setNewRecievedMessage] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const { startPlaying } = usePlayAudio("/light.mp3");
  const [pageTitle, changePageTitle] = useChangeTitle(defaultTitle);

  const newMessageReceived = useCallback(
    async (args) => {
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

export const useSocketNotifyPostLiked = (setNotificationUnread) => {
  const [newNotification, setNewNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const closeNotificationPopup = () => setShowNotificationPopup(false);

  const postLikedNotifyHandler = useCallback(
    ({ name, profilePicUrl, username, postId, postPic }) => {
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
    let timer;
    if (showNotificationPopup) {
      setTimeout(closeNotificationPopup, 5000);
    }
    return () => timer && clearTimeout(timer);
  }, [showNotificationPopup]);
  return [newNotification, showNotificationPopup, closeNotificationPopup];
};
