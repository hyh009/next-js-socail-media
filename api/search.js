const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  if (searchText.length === 0) return;
  try {
    const userPattern = new RegExp(`(^${searchText})|([ ]${searchText})`);
    const results = await UserModel.find({
      name: { $regex: userPattern, $options: "i" },
    });
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
