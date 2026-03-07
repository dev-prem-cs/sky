"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // 🆕 Import useSession
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { deletePost } from "@/app/actions/post.action"; // 🆕 Import your action

export default function ImageCard({ post }) {
  const { data: session } = useSession(); // 🆕 Get the logged-in user
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely extract data
  const imageUrl = post?.image_url || "https://images.unsplash.com/photo-1517849845537-4d257902454a";
  const username = post?.author?.username || post?.author?.name || "anonymous";
  const userImage = post?.author?.image || `https://ui-avatars.com/api/?name=${username}`;
  const title = post?.title || "Untitled";
  const description = post?.desc || "";
  const likesCount = post?.likes?.length || 0;
  const commentsCount = post?.comments?.length || 0;

  // 🎯 Check if the logged-in user is the author of this specific post
  const isOwner = session?.user?.id === (post?.author?._id || post?.author);

  const handleDelete = async () => {
    // 🛑 Simple browser confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (!confirmDelete) return;

    setIsDeleting(true);

    const result = await deletePost(post._id);

    if (!result.success) {
      alert(result.message);
      setIsDeleting(false); // Only stop loading if it failed (if it succeeds, the card vanishes anyway!)
    }
  };

  return (
    <div className={`relative w-full h-96 rounded-2xl overflow-hidden group shadow-lg ${isDeleting ? "opacity-50" : ""}`}>
      
      {/* 🖼️ Main Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 🌑 Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* 📝 Bottom Container */}
      <div className="absolute bottom-0 w-full p-4 flex items-end justify-between">
        
        {/* 👈 Left Side: Profile & Text info */}
        <div className="flex-1 pr-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={userImage} 
              alt={username} 
              className="w-8 h-8 rounded-full border border-white/50 object-cover"
            />
            <span className="text-sm font-semibold opacity-90">@{username}</span>
          </div>

          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-xs text-gray-300 line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        {/* 👉 Right Side: Action Icons */}
        <div className="flex flex-col gap-4 items-center pb-1">
          
          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-red-500/20 transition-colors">
              <Heart className="w-6 h-6 text-white group-hover/btn:text-red-500 transition-all" />
            </div>
            {likesCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{likesCount}</span>}
          </button>

          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
             <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-blue-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-white group-hover/btn:text-blue-400 transition-all" />
            </div>
            {commentsCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{commentsCount}</span>}
          </button>

          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
             <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-green-500/20 transition-colors">
              <Share2 className="w-6 h-6 text-white group-hover/btn:text-green-400 transition-all" />
            </div>
          </button>

          {/* 🎯 Conditional Delete / More Button */}
          {isOwner ? (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 pointer-events-auto group/delete mt-1"
            >
              {isDeleting ? (
                <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
              ) : (
                <Trash2 className="w-6 h-6 text-white/80 group-hover/delete:text-red-500 transition-all drop-shadow-md" />
              )}
            </button>
          ) : (
            <button className="p-2 pointer-events-auto mt-1">
              <MoreHorizontal className="w-6 h-6 text-white/80 hover:text-white" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}