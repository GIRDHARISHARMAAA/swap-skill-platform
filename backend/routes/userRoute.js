import express from "express";
import {
  getOtherUsers,
  login,
  logout,
  register,
  deleteUser,
  forgetPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Auth Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

// Password Recovery
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").put(resetPassword);
router.route("/verify-otp").post(verifyOtp);

// User Management
router.route("/delete-user").delete(deleteUser);

// Protected Route
router.route("/").get(isAuthenticated, getOtherUsers);

export default router;
