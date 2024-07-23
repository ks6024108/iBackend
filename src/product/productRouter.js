import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "./productControllers.js";
import Auth from "../middlewares/authMiddleware.js";
import AdminAuth from "../middlewares/adminauth.js";

const router = express.Router();

//get allproducts
router.get("/", Auth, getAllProducts);

// add new product(admin only)
router.post("/", Auth, AdminAuth, addProduct);

//update product(admin only)
router.put("/:id", Auth, AdminAuth, updateProduct);

//delete product(admin only)
router.delete("/:id", Auth, AdminAuth, deleteProduct);

export default router;
