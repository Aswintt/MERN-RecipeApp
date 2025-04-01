import express from "express";
import { UserModel } from "../models/Users.js";
import { RecipesModel } from "../models/Recipes.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ username });

    // If user does not exist
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password with hashed password stored in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized as an admin",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Payload (You can add other user data as well)
      "your_secret_key", // Secret key for signing the token
      { expiresIn: "1h" } // Token expiry time
    );

    // Respond with the token
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get All Users (excluding admins)
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({ isAdmin: false }, "username isBanned"); // Exclude users with isAdmin: true

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Ban/Unban a User
router.put("/users/:id/ban", async (req, res) => {
  try {
    const { isBanned } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { isBanned });
    res.json({
      success: true,
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating user ban status" });
  }
});

// ✅ Delete a User
router.delete("/users/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ✅ Get Paginated Posts (3 per page for lazy loading)
router.get("/posts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const posts = await RecipesModel.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the post by _id
    const deletedPost = await RecipesModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export { router as adminRouter };
