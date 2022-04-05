const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const bcrypt = require("bcryptjs");
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require("../utilsServer/notificationAction");

// get profile info by user
router.get("/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      "user"
    );
    const profileFollowStats = await FollowerModel.findOne({ user: user._id });
    return res.status(200).json({
      profile,
      followersLength:
        profileFollowStats.followers.length > 0
          ? profileFollowStats.followers.length
          : 0,
      followingLength:
        profileFollowStats.following.length > 0
          ? profileFollowStats.following.length
          : 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get followers info by user
router.get("/followers/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "followers.user"
    );

    return res.status(200).json(user.followers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// get following info by user
router.get("/following/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "following.user"
    );

    return res.status(200).json(user.following);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// follow a user
router.get("/follow/:userToFollowId", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userToFollowId } = req.params;
  try {
    const userToFollow = await FollowerModel.findOne({ user: userToFollowId });
    const user = await FollowerModel.findOne({ user: userId });
    if (!userToFollow || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersIndex = userToFollow.followers
      .map((item) => item.user.toString())
      .indexOf(userId); //return -1 if not found
    const followingIndex = user.following
      .map((item) => item.user.toString())
      .indexOf(userToFollowId);

    if (followersIndex >= 0 || followingIndex >= 0) {
      return res
        .status(400)
        .json({ message: "You have already followed this user" });
    }

    user.following.push({ user: userToFollowId });
    await user.save();

    userToFollow.followers.push({ user: userId });
    await userToFollow.save();

    // create notification
    await newFollowerNotification(userId, userToFollowId);
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// unfollow a user
router.get("/unfollow/:userToUnfollowId", authMiddleware, async (req, res) => {
  const { userId } = req;
  const { userToUnfollowId } = req.params;
  try {
    const userToUnfollow = await FollowerModel.findOne({
      user: userToUnfollowId,
    });
    const user = await FollowerModel.findOne({ user: userId });
    if (!userToUnfollow || !user) {
      return res.status(404).json({ message: "user not found" });
    }

    const removeFollowersIndex = userToUnfollow.followers
      .map((item) => item.user.toString())
      .indexOf(userId); //return -1 if not found
    const removeFollowingIndex = user.following
      .map((item) => item.user.toString())
      .indexOf(userToUnfollowId);

    if (removeFollowersIndex < 0 && removeFollowingIndex < 0) {
      return res
        .status(400)
        .json({ message: "You aren't following this user" });
    }
    userToUnfollow.followers.splice(removeFollowersIndex, 1);
    await userToUnfollow.save();
    user.following.splice(removeFollowingIndex, 1);
    await user.save();
    //remove notification
    await removeFollowerNotification(userId, userToUnfollowId);
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// update profile
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;

    const { bio, facebook, youtube, instagram, twitter, profilePicUrl } =
      req.body;
    let profileFields = {};
    profileFields.user = userId;
    profileFields.bio = bio;
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields }
    );

    if (profilePicUrl) {
      const user = await UserModel.findById(userId);
      user.profilePicUrl = profilePicUrl;
      await user.save();
    }

    return res.status(201).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// update password
router.put("/setting/password", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await UserModel.findById(userId).select("+password");
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// set whether to show message popup
router.put("/setting/messagepopup", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId);
    if (user.newMessagePopup === true) {
      user.newMessagePopup = false;
      await user.save();
    } else if (user.newMessagePopup === false) {
      user.newMessagePopup = true;
      await user.save();
    }
    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
