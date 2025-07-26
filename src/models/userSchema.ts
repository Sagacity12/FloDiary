import mongoose, { Schema } from "mongoose";
import { User } from "src/common/interfaces/user";

const UserSchema = new mongoose.Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    tempOTP: {
      type: String,
    },
    tempOTPExpiry: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("IUser", UserSchema);
