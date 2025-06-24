import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { UserModel } from "../models/Users.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const fdUrl = process.env.FD_URL || "https://recipefinderz.web.app";
router.get("/me/:id", async (req, res) => {
  try {
    const userID = req.params.userID;
    console.log("userID:", userID);

    const user = await UserModel.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body);

  const { username, email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.json({ message: "User Already exists!" });
  }
  const usernameExists = await UserModel.findOne({ username });
  if (usernameExists) {
    return res.json({ message: "This username is Taken" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, email, password: hashedPassword });

  await newUser.save();
  res.json({ message: "User Registered successfully!" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

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

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id, verify: "verify" });
});

router.post("/forgot-password", async (req, res) => {
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
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 5 minutes.</p>`,
    });

    res.json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});
router.post("/reset-password/:token", async (req, res) => {
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
});
export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
