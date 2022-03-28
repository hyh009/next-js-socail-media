const express = require("express");
const router = express.Router();
const UserModel = require("../../models/UserModel");
const ProfileModel = require("../../models/ProfileModel");
const FollowerModel = require("../../models/FollowerModel");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const userPng =
  "https://res.cloudinary.com/dh2splieo/image/upload/v1646928267/social_media/user_mklcpl_eezlmo.png";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    //check length
    if (username.length < 1)
      return res.status(401).json({ message: "Invalid username" });
    //check if contain invalid symbol
    if (!regexUserName.test(username))
      return res.status(401).json({ message: "Invalid username" });
    //check if username is taken
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (user)
      return res.status(401).json({ message: "Username is already taken" });

    res.status(200).json({ message: "Username is available" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    profilePicUrl,
    bio,
    facebook,
    youtube,
    instagram,
    twitter,
  } = req.body.user;
  // simple validation
  if (!isEmail(email))
    return res.status(401).json({ message: "email is invalid" });
  if (password.length < 6) {
    return res
      .status(401)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    // check if email already exist
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user)
      return res.status(401).json({ message: "email already registered" });
    // handle data
    user = new UserModel({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      profilePicUrl: profilePicUrl ? profilePicUrl : userPng,
    });
    // encrypt password
    user.password = await bcrypt.hash(password, 10);
    // save user
    await user.save();

    // profileModel
    let profileFields = {
      user: user._id,
      bio,
      socail: {},
    };
    if (facebook) profileFields.socail.facebook = facebook;
    if (instagram) profileFields.socail.instagram = instagram;
    if (youtube) profileFields.socail.youtube = youtube;
    if (twitter) profileFields.socail.twitter = twitter;
    // save profile model
    await new ProfileModel(profileFields).save();
    // create follower model
    await new FollowerModel({
      user: user._id,
      followers: [],
      following: [],
    }).save();

    res.status(200).json({ message: "user created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
