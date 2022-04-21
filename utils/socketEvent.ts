
const socketEvent = {
  USER_JOIN: "join" as const,
  USERS_CONNECTED: "connectedUsers" as const,
  USER_LEAVE: "leave" as const,
  MESSAGES_GET: "getMessages" as const,
  MESSAGES_LOADED: "messagesLoaded" as const,
  MESSAGE_SEND: "sendMessage" as const,
  MESSAGE_SAVE_AND_SENT: "saveMessage" as const,
  MESSAGE_RECEIVED: "receivedMessage" as const,
  MESSAGE_DELETE: "deleteMessage" as const,
  MESSAGE_DELETED_RESULT: "deletedMessageResult" as const,
  MESSAGE_DELETE_UPDATE: "updateMessageDelete" as const,
  POST_LIEK: "likePost" as const,
  POST_LIKED_DONE: "likedPost" as const,
  POST_LIKED_NOTIFY: "likePostNotify" as const,
};

export default socketEvent;
