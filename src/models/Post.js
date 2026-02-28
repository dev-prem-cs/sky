import mongoose, { Schema, models } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // 🆕 The missing piece: Storing the image URL!
    image_url: {
      type: String,
      default: "", // Optional: Leave empty if it's a text-only post
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    meta_tags: [
      {
        type: String,
        trim: true,
        lowercase: true, 
      }
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", 
      }
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        }
      }
    ]
  },
  { timestamps: true } 
);

const Post = models.Post || mongoose.model("Post", postSchema);

export default Post;