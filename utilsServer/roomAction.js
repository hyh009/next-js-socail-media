const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");

// track all users on server
const users = [];

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId);
  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }
    const newUser = { userId, socketId };
    users.push(newUser);
    return users;
  }
};

const removeUser = async (socketId) => {
  const indexOfRemoveUser = users
    .map((user) => user.socketId)
    .indexOf(socketId);

  users.splice(indexOfRemoveUser, 1);
  return;
};

const loadMessages = async (userId, messagesWith) => {
  try {
    const userChat = await ChatModel.findOne(
      {
        user: userId,
        "chats.messagesWith": messagesWith,
      },
      { "chats.$": 1 }
    ).populate("chats.messagesWith");
    if (!userChat) {
      return { error: "No chat found" };
    }
    return { chat: userChat.chats[0].messages };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const deleteMessage = async (userId, messagesWith, msgId) => {
  try {
    const {
      success: userSuccess,
      error: userError,
      isLastMsg,
    } = await deleteTargetMsg(msgId, userId, userId, messagesWith, true);
    const { success: messagesWithSuccess, error: messagesWithError } =
      await deleteTargetMsg(msgId, userId, messagesWith, userId, false);

    return {
      success: userSuccess && messagesWithSuccess,
      error: userError ? userError : messagesWithError,
      isLastMsg,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Server error" };
  }
};

const sendMessage = async (userId, messagesWith, msg) => {
  try {
    const newMsg = {
      sender: userId,
      receiver: messagesWith,
      msg,
      date: Date.now(),
      _id: uuidv4(),
    };
    // save newMsg to sender model
    await saveNewMessage(userId, messagesWith, newMsg);
    // save newMsg to receiver model
    await saveNewMessage(messagesWith, userId, newMsg);
    return { newMsg };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const findConnectedUser = (userId) =>
  users.find((user) => user.userId === userId);

const setMsgToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }
    return;
  } catch (error) {
    console.log(error);
    return { error };
  }
};
module.exports = {
  addUser,
  removeUser,
  loadMessages,
  sendMessage,
  findConnectedUser,
  setMsgToUnread,
  deleteMessage,
};

// for sendMessage action
const saveNewMessage = async (chatUser, chatMessageWith, newMsg) => {
  const chatUserRecord = await ChatModel.findOne({ user: chatUser });
  // check if chat history exist
  const previousChat = chatUserRecord.chats.find(
    (chat) => chat.messagesWith.toString() === chatMessageWith
  );

  if (previousChat) {
    // if previousChat exist just push new message into messages array
    previousChat.messages.push(newMsg);
    await chatUserRecord.save();
  } else {
    // create chat object if previousChat not exist
    const newChat = {
      messagesWith: chatMessageWith,
      messages: [newMsg],
    };
    chatUserRecord.chats.unshift(newChat);
    await chatUserRecord.save();
  }
};

// for deleteMessage action
const deleteTargetMsg = async (
  msgId,
  senderId,
  deleteMsgUserId,
  chatWithId,
  isActionUser
) => {
  try {
    const userChat = await ChatModel.findOne({
      user: deleteMsgUserId,
    });
    if (!userChat) return { success: false, error: "message not found" }; //chat document not found

    // find chat object with chatWithId
    const targetChat = userChat.chats.find(
      (chat) => chat.messagesWith.toString() === chatWithId
    );

    if (!targetChat && isActionUser)
      return { success: false, error: "message not found" }; // chat document not found
    if (!targetChat && !isActionUser) return { success: true, error: false }; // chat object was deleted by messageWith user

    // find the target message index to delete
    const deleteMsgIndex = targetChat.messages
      .map((msg) => msg._id)
      .indexOf(msgId);

    if (deleteMsgIndex < 0)
      return { success: false, error: "message not found" }; // msg not found

    if (targetChat.messages[deleteMsgIndex].sender.toString() !== senderId) {
      return { success: false, error: "You can't delete this message" }; // only allow message sender to delete message
    }
    targetChat.messages[deleteMsgIndex].msg = "**This message was deleted**";
    await userChat.save();
    // check if deleted msg is lastMessage
    if (isActionUser) {
      const isLastMsg = deleteMsgIndex === targetChat.messages.length - 1;
      return { success: true, error: false, isLastMsg };
    } else {
      return { success: true, error: false };
    }
  } catch (error) {
    return { success: false, error: "Server error" };
  }
};
