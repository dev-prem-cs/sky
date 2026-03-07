"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

export default function ImageCard({ post }) {
  // 🎯 Safely extract data from the database with fallbacks just in case!
  const imageUrl = post?.image_url || "https://images.unsplash.com/photo-1517849845537-4d257902454a";
  const username = post?.author?.username || post?.author?.name || "anonymous";
  const userImage = post?.author?.image || `https://ui-avatars.com/api/?name=${username}`;
  const title = post?.title || "Untitled";
  const description = post?.desc || "";
  const likesCount = post?.likes?.length || 0;
  const commentsCount = post?.comments?.length || 0;

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden group shadow-lg">
      
      {/* 🖼️ 1. Main Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 🌑 2. Dark Gradient Overlay (Essential for text readability) */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* 📝 3. Bottom Container */}
      <div className="absolute bottom-0 w-full p-4 flex items-end justify-between">
        
        {/* 👈 Left Side: Profile & Text info */}
        <div className="flex-1 pr-4 text-white">
          
          {/* 👤 User Profile */}
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={userImage} 
              alt={username} 
              className="w-8 h-8 rounded-full border border-white/50"
            />
            <span className="text-sm font-semibold opacity-90">@{username}</span>
          </div>

          {/* 📌 Title & Description */}
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-xs text-gray-300 line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        {/* 👉 Right Side: Action Icons */}
        <div className="flex flex-col gap-4 items-center pb-1">
          
          {/* ❤️ Like Button */}
          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-red-500/20 transition-colors">
              <Heart className="w-6 h-6 text-white group-hover/btn:text-red-500 group-hover/btn:fill-red-500 transition-all" />
            </div>
            {/* 🔢 Dynamic Like Count */}
            {likesCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{likesCount}</span>}
          </button>

          {/* 💬 Comment Button */}
          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
             <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-blue-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-white group-hover/btn:text-blue-400 transition-all" />
            </div>
            {/* 🔢 Dynamic Comment Count */}
            {commentsCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{commentsCount}</span>}
          </button>

          {/* 📤 Share Button */}
          <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
             <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-green-500/20 transition-colors">
              <Share2 className="w-6 h-6 text-white group-hover/btn:text-green-400 transition-all" />
            </div>
          </button>

          {/* ⚙️ More Button */}
          <button className="p-2 pointer-events-auto">
            <MoreHorizontal className="w-6 h-6 text-white/80 hover:text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}