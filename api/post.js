const express = require("express");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const authMiddleware = require("../middleware/authMiddleware");
const uuid = require("uuid").v4;
const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
} = require("../utilsServer/notificationAction");
// create a post
router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;
  if (text.length < 1)
    return res
      .status(400)
      .json({ message: "text must be at least 1 character" });
  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;
    const post = await new PostModel(newPost).save();
    return res.status(200).json(post._id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get all posts
router.get("/", authMiddleware, async (req, res) => {
  const { page } = req.query;
  const number = Number(page);
  const size = 8;
  try {
    const posts = await PostModel.find({})
      .limit(size * number)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");
    const totalPosts = await PostModel.find().countDocuments();

    return res.status(200).json({
      posts,
      currentPage: number,
      maxPage: Math.ceil(totalPosts / size),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get a post by ID
router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    // if (!ObjectId.isValid(postId)) {
    //   res.status(404).json({ message: "Invlid post Id" });
    // }
    const post = await PostModel.findById(postId)
      .populate("user")
      .populate("comments.user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get posts by users that request user is following
router.get("/user/following", authMiddleware, async (req, res) => {
  const { page } = req.query;
  try {
    const number = Number(page);
    const size = 8;
    const { userId } = req;

    const userFollowingStats = await FollowerModel.findOne({
      user: userId,
    }).select("-followers");

    let posts = [];
    let totalPosts = 0;
    if (userFollowingStats.following.length > 0) {
      posts = await PostModel.find({
        user: {
          $in: [
            userId,
            ...userFollowingStats.following.map((item) => item.user),
          ],
        },
      })
        .limit(size * number)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
      // only get the posts from the user that request user is following
      totalPosts = await PostModel.find({
        user: {
          $in: [
            userId,
            ...userFollowingStats.following.map((item) => item.user),
          ],
        },
      }).countDocuments();
    } else if (userFollowingStats.following.length === 0) {
      posts = await PostModel.find({ user: userId })
        .limit(size * number)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");

      totalPosts = await PostModel.find({ user: userId }).countDocuments();
    }

    return res.status(200).json({
      posts,
      currentPage: number,
      maxPage: Math.ceil(totalPosts / size),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get posts by user
router.get("/user/:username", authMiddleware, async (req, res) => {
  const { page } = req.query;
  const number = Number(page);
  const size = 8;
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await PostModel.find({ user: user._id })
      .limit(size * number)
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    const totalPosts = await PostModel.find({
      user: user._id,
    }).countDocuments();

    return res.status(200).json({
      posts,
      currentPage: number,
      maxPage: Math.ceil(totalPosts / size),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get likes in a post
router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post.likes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
});

// like a post
router.put("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findOne({ _id: postId });
    if (!post) return res.status({ message: "Post not found" });
    // check  if user liked post before
    const likeIndex = post.likes
      .map((item) => item.user.toString())
      .indexOf(userId);

    if (likeIndex >= 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }
    post.likes.push({ user: userId });
    await post.save();

    // create notification
    if (post.user.toString() !== userId) {
      await newLikeNotification(userId, postId, post.user.toString());
    }
    return res.status(200).json({ message: "post liked" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// unlike a post
router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: { user: userId } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    // remove notification
    if (post.user.toString() !== userId) {
      await removeLikeNotification(userId, postId, post.user.toString());
    }
    return res.status(200).json({ message: "Unliked post successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// create a comment
router.put("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (text.length === 0) {
      return res
        .status(400)
        .json({ message: "comment must be at least 1 character" });
    }
    const { postId } = req.params;
    const { userId } = req;
    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: newComment,
        },
      },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "post not found" });
    // create notification
    if (post.user.toString() !== userId) {
      await newCommentNotification(
        userId,
        newComment._id,
        postId,
        post.user.toString(),
        text
      );
    }
    return res.status(200).json({ message: "comment added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// delete a post
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() === userId || user.role === "admin") {
      await post.remove();
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// delete a comment
router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId).populate("comments.user");
    if (!post) return res.status(404).json({ message: "Post not found" });
    const deleteComment = post.comments.find(
      (comment) => comment._id === commentId
    );
    if (!deleteComment)
      return res.status(404).json({ message: "Comment not found" });
    //admin, post owner, comment owner can delete the comment
    if (
      userId !== deleteComment.user._id.toString() &&
      deleteComment.user.role !== "admin" &&
      userId !== post.user.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    // remove notification
    if (post.user.toString() !== userId) {
      removeCommentNotification(
        userId,
        commentId,
        postId,
        post.user.toString()
      );
    }
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
