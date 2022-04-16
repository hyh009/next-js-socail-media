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
      return {
        success: true,
        postData: { postByUserId: post.user.toString(), postPic: post.picUrl },
      };
    } else {
      const postLikeUserIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(userId);

      if (postLikeUserIndex < 0)
        return { success: false, error: "Post not liked before" };

      post.likes.splice(postLikeUserIndex, 1);
      await post.save();
      return {
        success: true,
        postData: { postByUserId: post.user.toString() },
      };
    }
  } catch (error) {
    return { error: "Server error" };
  }
};

const notifyPostOwner = async (userId, postId, postData, like) => {
  try {
    if (like) {
      // notification
      if (postData.postByUserId !== userId) {
        await newLikeNotification(userId, postId, postData.postByUserId);
      }
      // get user info for realtime notification
      const user = await UserModel.findById(userId);
      const { name, profilePicUrl, username } = user;
      return {
        notifySuccess: true,
        notifyError: false,
        data: {
          name,
          profilePicUrl,
          username,
          postPic: postData.picUrl,
        },
        postByUserId: postData.postByUserId,
      };
    } else {
      if (postData.postByUserId !== userId) {
        await removeLikeNotification(userId, postId, postData.postByUserId);
      }
      return { notifySuccess: true, notifyError: false };
    }
  } catch (error) {
    console.log(error);
    return { notifyError: "Server error" };
  }
};
module.exports = { toggleLikePost, notifyPostOwner };
