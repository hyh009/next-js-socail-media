const express = require("express");
const router = express.Router();
const NotificationModel = require("../models/NotificationModel");
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const userNotification = await NotificationModel.findOne({
      user: userId,
    })
      .populate("notifications.user")
      .populate("notifications.post");

    return res.status(200).json(userNotification);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const user = await UserModel.findById(userId);

    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }
    return res.status(200).json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
