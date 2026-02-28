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
    },
    // 🆕 New Fields Added Below:
    username: {
      type: String,
      required: true,
      unique: true, // Usernames must be unique!
    },
    profile_pic: {
      type: String,
      default: "", // Defaults to an empty string if they don't upload one
    },
    bio: {
      type: String,
      default: "",
      maxLength: 160, // Good practice to limit bio length!
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", // This tells Mongoose these IDs belong to the 'Post' model
      }
    ],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;