const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  const { userId } = req;
  if (searchText.length === 0) return;
  try {
    const userPattern = new RegExp(`(^${searchText})|([ ]${searchText})`);
    const results = await UserModel.find({
      name: { $regex: userPattern, $options: "i" },
    });
    let FilterCurrentUserResults = [];
    if (results.length > 0) {
      FilterCurrentUserResults = results.filter(
        (result) => result._id.toString() !== userId
      );
    }

    res.status(200).json(FilterCurrentUserResults);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/following/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  const { userId } = req;
  if (searchText.length === 0) return;
  try {
    const userPattern = new RegExp(`(^${searchText})|([ ]${searchText})`);
    const results = await FollowerModel.findOne({ user: userId }).populate({
      path: "following.user",
      match: { name: { $regex: userPattern, $options: "i" } },
    });

    const finalResults = results.following.filter((item) => item.user !== null);
    res.status(200).json(finalResults);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
