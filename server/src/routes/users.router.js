import express from "express";
import {
  getMe,
  userRegister,
  userLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/me/:id", getMe);
router.post("/register", userRegister); //new User registration
router.post("/login", userLogin); // registered user login
router.post("/forgot-password", forgotPassword); // forgot password
router.post("/reset-password/:token", resetPassword); // update new password with token

export { router as userRouter };
