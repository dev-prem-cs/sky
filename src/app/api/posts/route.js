import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path if needed!
import { connectMongoDB } from "@/app/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1. Secure the route! Get the session directly from the server
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract data from the frontend request
    // 🆕 We added `visibility` to the extracted variables!
    // const { title, desc, image_url, meta_tags, visibility } = await req.json();
    const { title, desc, image_url, image_file_id, meta_tags, visibility } = await req.json();
    if (!title || !desc) {
      return NextResponse.json({ message: "Title and description are required." }, { status: 400 });
    }

    // 3. Connect to DB
    await connectMongoDB();

    // 4. Create the Post! We use the session.user.id for the author
    const newPost = await Post.create({
      title,
      desc,
      image_url: image_url || "", // Optional
      image_file_id: image_file_id || "",
      author: session.user.id,    // 🎯 Here is where the magic happens!
      // 🎯 Checks if it is already an array from our new UI!
        meta_tags: Array.isArray(meta_tags) 
          ? meta_tags.map(tag => String(tag).trim().toLowerCase()) 
          : [],
      // 🆕 Save the visibility choice to the database (falling back to "public" just in case)
      visibility: visibility || "public", 
    });

    // 5. Bonus: Update the User's 'posts' array so they keep a record of what they wrote!
    // await User.findByIdAndUpdate(session.user.id, {
    //   $push: { posts: newPost._id }
    // });

    return NextResponse.json({ message: "Post created successfully!", post: newPost }, { status: 201 });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
  }
}