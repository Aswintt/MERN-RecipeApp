import express from "express";
import {
  adminLogin,
  getAllUsers,
  userBanUnban,
  deleteUser,
  getAllPosts,
  deletePost,
  clearReports,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin); // Admin Login Route
router.get("/users", getAllUsers); //Get All normal Users
router.put("/users/:id/ban", userBanUnban); // Ban/Unban a User
router.delete("/users/:id", deleteUser); // Delete a User
router.delete("/posts/:id", deletePost); // Delete a Post
router.get("/posts", getAllPosts); //Get All posts

router.put("/posts/:id/clear-reports", clearReports);

export { router as adminRouter };
