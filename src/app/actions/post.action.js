"use server";

import mongoose from "mongoose";
import Post from "@/models/Post";
import User from "@/models/User";
import { connectMongoDB } from "@/app/lib/mongodb";


// 🎯 The ONE and ONLY fetchPosts function!
export async function fetchPosts(page = 1, limit = 5, tag = null) {
  try {
    await connectMongoDB();

    const skipAmount = (page - 1) * limit;

    // Create a dynamic query object
    const query = {};
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