const express = require("express");
const router = express.Router();
const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

// Get all chats simple information (overview)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await ChatModel.findOne({ user: userId }).populate(
      "chats.messagesWith"
    );
    let chatsToBeSent = [];
    if (user.chats.length > 0) {
      chatsToBeSent = user.chats.map((chat) => ({
        messagesWith: chat.messagesWith._id,
        name: chat.messagesWith.name,
        profilePicUrl: chat.messagesWith.profilePicUrl,
        lastMessage: chat.messages[chat.messages.length - 1]?.msg || null,
        date: chat.messages[chat.messages.length - 1]?.date || null,
      }));
    }
    return res.status(200).json({ chatsToBeSent });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get Chat User Info
router.get("/user/:userToFindId", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userToFindId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ name: user.name, profilePicUrl: user.profilePicUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete a chat
router.delete("/:messagesWith", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { messagesWith } = req.params;
    const user = await ChatModel.findOne({ user: userId });
    const chatToDeleteIndex = user.chats
      .map((chat) => chat.messagesWith.toString())
      .indexOf(messagesWith);
    if (chatToDeleteIndex < 0) {
      return res.status(404).json({ message: "Chat not found" });
    }
    user.chats.splice(chatToDeleteIndex, 1);
    await user.save();
    return res.status(200).json({ message: "chat deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
