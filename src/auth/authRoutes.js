import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from "./authControllers.js";

const router = express.Router();

//register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//reset password
router.post("/reset-password/:token", resetPasswordController);

export default router;
