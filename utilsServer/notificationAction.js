const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

// set unreadNotification to true
const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }
    return;
  } catch (err) {
    console.error(err);
  }
};

// post liked
const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNofify = await NotificationModel.findOne({
      user: userToNotifyId,
    });
    const newNotification = {
      type: "newLike",
      user: userId,
      post: postId,
      date: Date.now(),
    };
    userToNofify.notifications.unshift(newNotification);
    await userToNofify.save();
    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.error(err);
  }
};

// post unliked
const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      {
        $pull: {
          notifications: { type: "newLike", user: userId, post: postId },
        },
      }
    );
    return;
  } catch (err) {
    console.error(err);
  }
};

// comment added
const newCommentNotification = async (
  userId,
  commentId,
  postId,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newComment",
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now(),
    };

    userToNotify.notifications.unshift(newNotification);

    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.error(err);
  }
};

// comment remove
const removeCommentNotification = async (
  userId,
  commentId,
  postId,
  userToNotifyId
) => {
  try {
    await NotificationModel.findOneAndUpdate(
      {
        user: userToNotifyId,
      },
      {
        $pull: {
          notifications: {
            type: "newComment",
            post: postId,
            commentId,
            user: userId,
          },
        },
      }
    );
    return;
  } catch (err) {
    console.error(err);
  }
};

// follow user
const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };

    userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();
    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.error(err);
  }
};

// unfollow user
const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userToNotifyId },
      { $pull: { notifications: { type: "newFollower", user: userId } } }
    );

    return;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification,
};
