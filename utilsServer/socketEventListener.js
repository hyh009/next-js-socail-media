const {
  addUser,
  removeUser,
  loadMessages,
  sendMessage,
  findConnectedUser,
  setMsgToUnread,
  deleteMessage,
} = require("./roomAction");
const { toggleLikePost, notifyPostOwner } = require("./postAction");
const socketEvent = require("./socketEvent");

module.exports = function (io) {
  // handle chat room
  io.on("connection", (socket) => {
    // user join chat room
    socket.on(socketEvent.USER_JOIN, async ({ userId }) => {
      const users = await addUser(userId, socket.id);
      setInterval(() => {
        socket.emit(socketEvent.USERS_CONNECTED, {
          users: users.filter((user) => user.userId !== userId),
        });
      }, 10000);
    });

    // load messages
    socket.on(socketEvent.MESSAGES_GET, async ({ userId, messagesWith }) => {
      const { chat, error } = await loadMessages(userId, messagesWith);

      if (!error) {
        socket.emit(socketEvent.MESSAGES_LOADED, { chat });
      }
      if (error === "No chat found") {
        socket.emit(socketEvent.MESSAGES_LOADED, {});
      }
      console.log("message load error", error);
    });

    // receive message
    socket.on(
      socketEvent.MESSAGE_SEND,
      async ({ userId, messagesWith, msg }) => {
        const { newMsg, error } = await sendMessage(userId, messagesWith, msg);
        const receiverSocket = findConnectedUser(messagesWith);
        // if receiver(messagesWith) is online, send message to receiver now
        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit(socketEvent.MESSAGE_RECEIVED, {
            newMsg,
          });
        } else {
          // if receiver is offline, set unread message to true
          await setMsgToUnread(messagesWith);
        }

        if (!error) {
          // send message to sender
          socket.emit(socketEvent.MESSAGE_SAVE_AND_SENT, { newMsg });
        }
      }
    );

    // delete message
    socket.on(
      socketEvent.MESSAGE_DELETE,
      async ({ userId, messagesWith, msgId }) => {
        const { success, error, isLastMsg } = await deleteMessage(
          userId,
          messagesWith,
          msgId
        );

        if (success) {
          socket.emit(socketEvent.MESSAGE_DELETED_RESULT, {
            success,
            isLastMsg,
          });
          const receiverSocket = findConnectedUser(messagesWith);
          if (receiverSocket) {
            io.to(receiverSocket.socketId).emit(
              socketEvent.MESSAGE_DELETE_UPDATE,
              { messagesWith: userId, msgId, isLastMsg }
            );
          }
        } else if (error) {
          socket.emit(socketEvent.MESSAGE_DELETED_RESULT, { error });
        }
      }
    );

    // user leave chat room
    socket.on(socketEvent.USER_LEAVE, async () => {
      removeUser(socket.id);
    });

    // toggle like
    socket.on(socketEvent.POST_LIEK, async ({ postId, userId, like }) => {
      const { success, error, postData } = await toggleLikePost(
        postId,
        userId,
        like
      );
      if (success) {
        socket.emit(socketEvent.POST_LIKED_DONE, {
          success,
        });

        const { notifySuccess, notifyError, data, postByUserId } =
          await notifyPostOwner(userId, postId, postData, like);
        // notify post owner if post.user._id !== userId
        if (notifySuccess) {
          if (postByUserId !== userId) {
            const receiverSocket = findConnectedUser(postByUserId);
            if (receiverSocket && like) {
              io.to(receiverSocket.socketId).emit(
                socketEvent.POST_LIKED_NOTIFY,
                {
                  ...data, // name, profilePicUrl, username, postPic
                  postId,
                }
              );
            }
          }
        } else if (notifyError) {
          console.log(notifyError);
        }
      }

      if (error) {
        socket.emit(socketEvent.POST_LIKED_DONE, {
          error,
        });
      }
    });
  });
};
