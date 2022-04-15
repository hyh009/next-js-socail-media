const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const {
  newLikeNotification,
  removeLikeNotification,
} = require("../utilsServer/notificationAction");

const toggleLikePost = async (postId, userId, like) => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) return { suceess: false, error: "No Post Found" };

    if (like) {
      const postLikeUserIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(userId);

      if (!postLikeUserIndex < 0)
        return { success: false, error: "Post liked before" };
      post.likes.unshift({ user: userId });
      await post.save();

      // notification
      if (post.user.toString() !== userId) {
        await newLikeNotification(userId, postId, post.user.toString());
      }
    } else {
      const postLikeUserIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(userId);

      if (postLikeUserIndex < 0)
        return { success: false, error: "Post not liked before" };

      post.likes.splice(postLikeUserIndex, 1);
      await post.save();
      // remove notification
      if (post.user.toString() !== userId) {
        await removeLikeNotification(userId, postId, post.user.toString());
      }
    }
    // get user info for realtime notification
    const user = await UserModel.findById(userId);
    const { name, profilePicUrl, username } = user;
    return {
      success: true,
      error: false,
      data: {
        name,
        profilePicUrl,
        username,
        postPic: post.picUrl,
      },
      postByUserId: post.user.toString(),
    };
  } catch (error) {
    return { error: "Server error" };
  }
};

module.exports = { toggleLikePost };
