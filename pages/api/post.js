const express = require("express");
const router = express.Router();
const PostModel = require("../../models/PostModel");
const FollowerModel = require("../../models/FollowerModel");
const authMiddleware = require("../../middleware/authMiddleware");
const uuid = require("uuid").v4;
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
    const post = await PostModel.findById(req.params.postId)
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
    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: { user: userId } } },
      { new: true }
    );
    if (!post) return res.status({ message: "Post not found" });
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
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
