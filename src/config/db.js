import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    //events while connecting
    mongoose.connection.on("connected", () => {
      console.log("connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("error in connecting to database", err);
    });

    await mongoose.connect(config.databaseUrl);
  } catch (error) {
    console.error("failed to connect to database", error);
    process.exit(1);
  }
};

export default connectDB;
