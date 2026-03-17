import { connectMongoDB } from "../lib/mongodb";
import User from "@/models/User";



// 🎯 Fetch a public user profile and their public posts
import Post from "@/models/Post"; // Make sure to import Post at the top if it isn't already!

export async function getPublicUserProfile(userId) {
  try {
    await connectMongoDB();

    // 1. Get the user's basic public info
    const user = await User.findById(userId).select("name username image bio").lean();
    if (!user) return null;

    // 2. Get ONLY their public posts
    const publicPosts = await Post.find({ author: userId, visibility: "public" })
      .populate({ path: "author", select: "name username image" })
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return {
      user: JSON.parse(JSON.stringify(user)),
      posts: JSON.parse(JSON.stringify(publicPosts))
    };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}