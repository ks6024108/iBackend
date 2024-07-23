import express from "express";
const router = express.Router();
import Auth from "../middlewares/authMiddleware.js";
import { UserInfo } from "./userControllers.js";

router.get("/info", Auth, UserInfo);

export default router;
