import { getPostById } from "@/app/actions/post.action";
import ImageCard from "@/app/_components/ImageCard";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed!

export default async function SinglePostPage({ params }) {
  // Next.js requires us to await params in recent versions
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  const post = await getPostById(postId);
  const session = await getServerSession(authOptions);

  // 1. If the post doesn't exist or was deleted
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found 🕵️‍♂️</h1>
        <Link href="/" className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all">
          Go back home
        </Link>
      </div>
    );
  }

  // 2. SECURITY CHECK 🛡️: Is it private?
  const isOwner = session?.user?.id === (post.author._id || post.author);
  if (post.visibility === "private" && !isOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Lock className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">This post is private</h1>
        <p className="text-gray-500 mb-6">Only the author can view this content.</p>
        <Link href="/" className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all">
          Go back home
        </Link>
      </div>
    );
  }

  // 3. If it's public (or the owner is viewing it), show the post!
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        
        {/* Clean Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to feed
        </Link>
        
        {/* 🎯 Reusing your awesome ImageCard! */}
        <ImageCard post={post} fullView={true}/>
        
      </div>
    </div>
  );
}