"use server";

import mongoose from "mongoose";
import Post from "@/models/Post";
import ImageKit from "@imagekit/nodejs"; // 👈 Good job updating this!
import User from "@/models/User";
import { connectMongoDB } from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route"; 
import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";


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
      // 🆕 ADD THIS LINE SO COMMENTS HAVE USERNAMES:
      .populate({ path: "comments.user", select: "name username image" }) 
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
// 🎯 Fetch only tags from public posts
export async function fetchTags() {
  try {
    await connectMongoDB();

    // 🎯 NEW: Add the visibility filter right here!
    const rawTags = await Post.distinct("meta_tags", { visibility: "public" });
    
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


// 🎯 Securely toggle a Like on a post
export async function toggleLike(postId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await connectMongoDB();

    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    const userId = session.user.id;
    
    // Check if the user's ID is already in the likes array
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // If they already liked it, remove their ID (Unlike)
      post.likes.pull(userId);
    } else {
      // If they haven't liked it, add their ID (Like)
      post.likes.push(userId);
    }

    await post.save();

    // Refresh the paths in the background to keep the server cache updated
    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true, isLiked: !hasLiked };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, message: "Failed to toggle like" };
  }
}




// 🎯 Securely add a comment to a post
export async function addComment(postId, text) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }
    const cleanText = DOMPurify.sanitize(text.trim());
    
    if (!cleanText) return { success: false, message: "Comment cannot be empty" };

    if (!text || text.trim() === "") {
      return { success: false, message: "Comment cannot be empty" };
    }

    await connectMongoDB();

    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    // 1. Create the new comment object
    const newComment = {
      user: session.user.id,
      text: cleanText,
      createdAt: new Date(),
    };

    // 2. Push it to the post's comments array
    post.comments.push(newComment);
    await post.save();

    // 3. Re-fetch the post to populate the user data of the new comment
    // This allows us to instantly send back the commenter's name and picture!
    const updatedPost = await Post.findById(postId)
      .populate({ path: "comments.user", select: "name username image" })
      .lean();

    // 4. Get the exact comment we just added (the last one in the array)
    const savedComment = updatedPost.comments[updatedPost.comments.length - 1];

    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true, comment: JSON.parse(JSON.stringify(savedComment)) };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, message: "Failed to add comment" };
  }
}




export async function updateUserProfile(bio, imageUrl, imageId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    await connectMongoDB();
    const cleanBio = DOMPurify.sanitize(bio ? bio.trim() : "");
    // 1. Prepare the fields we want to update
    const updateData = { cleanBio };
    
    // 2. If they uploaded a new image, add it to the update object
    if (imageUrl) {
      updateData.profile_pic = {
        url: imageUrl,
        fileId: imageId
      };
      // NextAuth uses the native 'image' field, so we update that too for sync!
      updateData.image = imageUrl; 
    }

    // 3. Update the user in the database
    await User.findByIdAndUpdate(session.user.id, updateData);

    // 4. Refresh the profile page to show the new data instantly
    revalidatePath("/profile");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}



// 🎯 Fetch a single post by its ID
export async function getPostById(postId) {
  try {
    await connectMongoDB();

    const rawPost = await Post.findById(postId)
      .populate({ path: "author", select: "name username image" })
      .populate({ path: "comments.user", select: "name username image" }) // Grab commenter info too!
      .lean();

    if (!rawPost) return null;

    return JSON.parse(JSON.stringify(rawPost));
  } catch (error) {
    console.error("Failed to fetch single post:", error);
    return null;
  }
}