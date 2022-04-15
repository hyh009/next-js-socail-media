const socketEvent = {
  USER_JOIN: "join",
  USERS_CONNECTED: "connectedUsers",
  USER_LEAVE: "leave",
  MESSAGES_GET: "getMessages",
  MESSAGES_LOADED: "messagesLoaded",
  MESSAGE_SEND: "sendMessage",
  MESSAGE_SAVE_AND_SENT: "saveMessage",
  MESSAGE_RECEIVED: "receivedMessage",
  MESSAGE_DELETE: "deleteMessage",
  MESSAGE_DELETED_RESULT: "deletedMessageResult",
  MESSAGE_DELETE_UPDATE: "updateMessageDelete",
  POST_LIEK: "likePost",
  POST_LIKED_DONE: "likedPost",
  POST_LIKED_NOTIFY: "likePostNotify",
};

module.exports = socketEvent;
