import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

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

  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (user) {
    return res.json({ message: "User Already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });

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

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
