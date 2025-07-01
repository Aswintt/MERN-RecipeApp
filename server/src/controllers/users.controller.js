import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { UserModel } from "../models/users.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const fdUrl = process.env.FD_URL || "https://recipefinderz.web.app";

export const getMe = async (req, res) => {
  try {
    const userID = req.params.userID;
    // console.log("userID:", userID);

    const user = await UserModel.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (!emailRegex.test(email)) {
    return res.json({ message: "Invalid email address." });
  }

  if (!usernameRegex.test(username)) {
    return res.json({ message: "Username should not contain symbols." });
  }

  if (!password || password.length < 6) {
    return res.json({
      message: "Password must be at least 6 characters long.",
    });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({ message: "User Already exists!" });
    }
    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return res.json({ message: "This username is Taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ fMessage: "User Registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const userLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let useThis = {};
    if (emailRegex.test(username)) {
      // console.log("Valid email!");
      useThis = { email: username };
    } else {
      useThis = { username };
      // console.log("Valid Username!");
    }
    const user = await UserModel.findOne(useThis);

    if (!user) {
      return res.json({ message: "User doesn't Exist" });
    }

    // ✅ Check if the user is banned
    if (user.isBanned) {
      return res.json({ message: "You are banned from logging in." });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if (!isPasswordVaild) {
      return res.json({ message: "Username or Password is Incorrect! " });
    }

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });
    res.json({
      token,
      userID: user._id,
      userName: user.username,
      verify: "verify",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
    const resetLink = `${fdUrl}/forgot-verify/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - Recipe Finder",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 5 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated. Please login." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
