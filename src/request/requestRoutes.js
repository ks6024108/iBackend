import express from "express";
import Auth from "../middlewares/authMiddleware.js";
import {
  createRequest,
  getRequestByStatus,
  getUserRequests,
  returnRequest,
  updateRequestStatus,
} from "./requestControllers.js";
import AdminAuth from "../middlewares/adminauth.js";

const router = express.Router();

//create request
router.post("/", Auth, createRequest);

//update requets status
router.put("/:requestName/status", Auth, AdminAuth, updateRequestStatus);

//get request by status
router.get("/status/:status", Auth, AdminAuth, getRequestByStatus);

//get user requests
router.get("/user/:userId", Auth, getUserRequests);

//return request
router.put("/return/:requestName/user/:userId", Auth, AdminAuth, returnRequest);

export default router;
