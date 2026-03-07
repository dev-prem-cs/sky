import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      // Note: Make sure to hash this with bcrypt before saving!
    },
    username: {
      type: String,
      required: true,
      unique: true, 
      trim: true, // Automatically removes accidental spaces at the beginning/end
    },
    profile_pic: {
      url: { 
        type: String, 
        default: "" 
      },
      fileId: { 
        type: String, 
        default: "" 
      }, // 🔑 Required for deleting/updating images in ImageKit
    },
    bio: {
      type: String,
      default: "",
      maxLength: 160, 
    },
    // 🚨 Removed the 'posts' array to prevent 16MB limit crashes. 
    // We will handle the relationship in the Post model instead!
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;