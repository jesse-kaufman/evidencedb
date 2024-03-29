// User controllers

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/auth");

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred!! " });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }

    const payload = { userId: user._id };
    const token = generateToken(payload);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred while logging in" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred!!" });
  }
};
