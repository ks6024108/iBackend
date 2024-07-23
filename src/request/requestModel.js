import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    requestName: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Returned"],
      default: "Pending",
    },
    requestDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
