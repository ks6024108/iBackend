import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    contactNumber: { type: String, required: true },
    extensionNumber: { type: String, required: true },
    mailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    adminPassword: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires:{type:Date}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
