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
    image_url: {
      type: String,
      default: "", 
    },
    image_url: {
      type: String,
      default: "", 
    },
    // 🆕 NEW: We need this to tell ImageKit exactly which file to delete!
    image_file_id: {
      type: String,
      default: "",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    
    // 🆕 NEW: Keeping track of public vs private posts!
    visibility: {
      type: String,
      enum: ["public", "private"], // Strictly limits values to these two options
      default: "public",           // Makes posts public by default
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