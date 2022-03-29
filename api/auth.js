const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middleware/authMiddleware");
const cookie = require("cookie");

// get user & follower & following info
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId; // set in middleware

  try {
    const user = await UserModel.findById(userId);
    const userFollowStats = await FollowerModel.findOne({ user: userId });

    return res.status(200).json({ user, userFollowStats });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// user login
router.post("/", async (req, res) => {
  const { email, password } = req.body.user;
  // simple validation
  if (!isEmail(email))
    return res.status(401).json({ message: "email is invalid" });
  if (password.length < 6) {
    return res
      .status(401)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user)
      return res
        .status(401)
        .json({ messgae: "email or password is not correct" });

    // if user exist check if password match
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ messgae: "email or password is not correct" });
    }
    // create and save jwt token
    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.JWT_SECRECT,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(token);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

// set cookie for auth
router.post("/setcookie", (req, res) => {
  const { token } = req.body;
  // save cookies
  const serialized = cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 2, // 2 days
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "cookie set successfully" });
});

// verify token (for protected page)
router.get("/verifyuser", authMiddleware, (req, res) => {
  try {
    if (req.userId) {
      res.status(200).json({ message: "valid user" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res) => {
  const jwtToken = req.cookies.token;
  if (!jwtToken) return res.status(200).json({ message: "already logged out" });
  const serialized = cookie.serialize("token", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "logged out successfully" });
});
module.exports = router;
