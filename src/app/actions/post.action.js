"use server";

import mongoose from "mongoose";
import Post from "@/models/Post";
import ImageKit from "@imagekit/nodejs"; // 👈 Good job updating this!
import User from "@/models/User";
import { connectMongoDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route"; 
import { revalidatePath } from "next/cache";

// 🎯 NEW: Initialize ImageKit connection with your secure API keys!
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

// 🎯 The ONE and ONLY fetchPosts function!
export async function fetchPosts(page = 1, limit = 5, tag = null) {
  try {
    await connectMongoDB();

    const skipAmount = (page - 1) * limit;

    // Create a dynamic query object
    const query = { visibility: "public" };
    if (tag && tag !== "All") {
      query.meta_tags = tag; 
    }

    const rawPosts = await Post.find(query)
      .populate({ path: "author", select: "name username image" })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(rawPosts));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

// 🎯 The tags function we added earlier
export async function fetchTags() {
  try {
    await connectMongoDB();

    const rawTags = await Post.distinct("meta_tags");
    const validTags = rawTags.filter(tag => tag && tag.trim() !== "");

    return validTags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

// 🎯 Function to handle search queries
export async function searchPosts(searchTerm) {
  try {
    await connectMongoDB();

    if (!searchTerm || searchTerm.trim() === "") return [];

    // Create a case-insensitive regular expression from the search term
    const regex = new RegExp(searchTerm, "i");

    // Search where the title, desc, OR meta_tags match the regex
    const rawPosts = await Post.find({
      $or: [
        { title: { $regex: regex } },
        { desc: { $regex: regex } },
        { meta_tags: { $regex: regex } }
      ]
    })
      .populate({ path: "author", select: "name username image" })
      .sort({ createdAt: -1 })
      .limit(20) // Limit results to keep it fast
      .lean();

    return JSON.parse(JSON.stringify(rawPosts));
  } catch (error) {
    console.error("Failed to search posts:", error);
    return [];
  }
}

// 🎯 Fetch posts created by a specific user
export async function fetchUserPosts(userId) {
  try {
    await connectMongoDB();

    if (!userId) return [];

    const rawPosts = await Post.find({ author: userId })
      .populate({ path: "author", select: "name username image" })
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return JSON.parse(JSON.stringify(rawPosts));
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return [];
  }
}

// 🎯 Securely delete a post
export async function deletePost(postId) {
  try {
    // 1. Authenticate the user securely on the server
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await connectMongoDB();

    // 2. Find the post first to verify ownership
    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    // 3. Security Check: Ensure the logged-in user actually owns this post!
    // Because we populated the author, we check post.author._id
    const postAuthorId = post.author._id ? post.author._id.toString() : post.author.toString();
    
    if (postAuthorId !== session.user.id) {
      return { success: false, message: "You can only delete your own posts." };
    }

    // 🎯 NEW: Delete the image from ImageKit!
    if (post.image_file_id) {
      try {
        // 👈 Notice this is lowercase 'imagekit' now!
        await imagekit.files.delete(post.image_file_id);
      } catch (ikError) {
        console.error("Failed to delete image from ImageKit:", ikError);
        // We log the error but don't stop the DB deletion, 
        // just in case the file was already manually deleted in ImageKit.
      }
    }
    // 4. Delete the post from the Post collection
    await Post.findByIdAndDelete(postId);


    // 5. Tell Next.js to refresh the UI immediately
    revalidatePath("/profile"); 
    revalidatePath("/"); 

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post" };
  }
}