import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRoutes from "../src/auth/authRoutes.js";
import productRoutes from "../src/product/productRouter.js";
import requestRoutes from "../src/request/requestRoutes.js";
import userRoutes from "../src/user/userRoutes.js";
import cors from "cors";
import { config } from "./config/config.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1", userRoutes);

app.use(globalErrorHandler);

export default app;
