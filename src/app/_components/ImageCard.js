"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; 
// 🎯 Added Check icon for the share button!
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Loader2, X, Send, Check ,Download } from "lucide-react";
import { deletePost, toggleLike, addComment } from "@/app/actions/post.action"; 
import Link from "next/link"; // 🎯 NEW: Import Next.js Link!

export default function ImageCard({ post ,fullView = false}) {
  const { data: session } = useSession(); 
  const [isDeleting, setIsDeleting] = useState(false);

  // Safely extract data
  const imageUrl = post?.image_url || "https://images.unsplash.com/photo-1517849845537-4d257902454a";
  const username = post?.author?.username || post?.author?.name || "anonymous";
  const userImage = post?.author?.image || `https://ui-avatars.com/api/?name=${username}`;
  const title = post?.title || "Untitled";
  const description = post?.desc || "";

  // 🎯 Liking State
  const isOwner = session?.user?.id === (post?.author?._id || post?.author);
  const initialLikesCount = post?.likes?.length || 0;
  const initialIsLiked = session?.user?.id ? post?.likes?.includes(session.user.id) : false;

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // 💬 Commenting State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // downloading state
  const [isDownloading, setIsDownloading] = useState(false);
  // 📤 Share State
  const [isCopied, setIsCopied] = useState(false);

  // --- Handlers ---
  const handleLike = async () => {
    if (!session?.user) return alert("Please log in to like posts! ❤️");
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    const result = await toggleLike(post._id);
    if (!result.success) {
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
    setIsDeleting(true);
    const result = await deletePost(post._id);
    if (!result.success) {
      alert(result.message);
      setIsDeleting(false); 
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!session?.user) return alert("Please log in to comment! 💬");
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(post._id, commentText);

    if (result.success) {
      setCommentsList((prev) => [...prev, result.comment]);
      setCommentText(""); 
    } else {
      alert(result.message);
    }
    setIsSubmitting(false);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    const shareData = {
      title: title,
      text: `Check out "${title}" by @${username} on our app!`,
      url: shareUrl,
    };

    try {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

// 💾 Force Download Function
  const handleDownload = async (e) => {
    e.preventDefault(); // Stop the card from navigating to the post page!
    setIsDownloading(true);

    try {
      // 1. Fetch the image data directly
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // 2. Create a temporary local URL for the downloaded data
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 3. Create a fake invisible link, click it, and destroy it!
      const link = document.createElement("a");
      link.href = blobUrl;
      
      // Format a clean file name based on the post title (e.g., "my_cool_photo.jpg")
      const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
      link.download = `${safeTitle || "image"}.jpg`; 
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 4. Clean up the memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback: If their browser blocks the secret download, just open it normally
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* --- Main Image Card --- */}
      {/* --- Main Image Card --- */}
      {/* 🎯 1. Change the height and add a black background if in fullView mode */}
      <div className={`relative w-full ${fullView ? "h-[65vh] sm:h-[80vh] bg-gray-900" : "h-96"} rounded-2xl overflow-hidden group shadow-lg ${isDeleting ? "opacity-50" : ""}`}>
        
        {/* 🔗 2. Disable the link cursor if we are already viewing the full post */}
        <Link href={`/post/${post._id}`} className={`block w-full h-full ${fullView ? "cursor-default pointer-events-none" : "cursor-pointer"}`}>
          
          {/* 🖼️ 3. Switch between object-contain (fit) and object-cover (fill) */}
          <img 
            src={imageUrl} 
            alt={title} 
            className={`w-full h-full transition-transform duration-500 ${fullView ? "object-contain" : "object-cover group-hover:scale-105"}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        </Link>
        {/* 🛑 Add pointer-events-none here so the transparent areas don't block the background link */}
        <div className="absolute bottom-0 w-full p-4 flex items-end justify-between pointer-events-none">
          
          {/* 🔗 2. Make the Text area a clickable Link too, and restore its pointer-events! */}
          {/* 👈 Text & Author Info */}
          <div className="flex-1 pr-4 text-white pointer-events-auto">
            
            {/* 👤 Clickable Author Link */}
            <Link 
              href={`/user/${post?.author?._id || post?.author}`} 
              className="inline-flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src={userImage} alt={username} className="w-8 h-8 rounded-full border border-white/50 object-cover" />
              <span className="text-sm font-semibold opacity-90 drop-shadow-md">@{username}</span>
            </Link>

            {/* 📌 Clickable Post Title/Desc Link */}
            <Link href={`/post/${post._id}`} className="block cursor-pointer group/text">
              <h3 className="text-lg font-bold leading-tight group-hover/text:underline decoration-white/50 underline-offset-4">{title}</h3>
              <p className="text-xs text-gray-300 line-clamp-2 mt-1 drop-shadow-sm">{description}</p>
            </Link>
            
          </div>
          {/* <Link href={`/post/${post._id}`} className="flex-1 pr-4 text-white pointer-events-auto cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <img src={userImage} alt={username} className="w-8 h-8 rounded-full border border-white/50 object-cover" />
              <span className="text-sm font-semibold opacity-90">@{username}</span>
            </div>
            <h3 className="text-lg font-bold leading-tight">{title}</h3>
            <p className="text-xs text-gray-300 line-clamp-2 mt-1">{description}</p>
          </Link> */}

          {/* 👆 3. Keep the Action Buttons clickable by restoring pointer-events-auto */}
          <div className="flex flex-col gap-4 items-center pb-1 pointer-events-auto">
            
            <button onClick={handleLike} className="flex flex-col items-center gap-1 group/btn">
              <div className={`p-2 backdrop-blur-md rounded-full transition-colors ${isLiked ? "bg-red-500/20" : "bg-white/10 group-hover/btn:bg-red-500/20"}`}>
                <Heart className={`w-6 h-6 transition-all ${isLiked ? "text-red-500 fill-red-500 scale-110" : "text-white group-hover/btn:text-red-500"}`} />
              </div>
              {likesCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{likesCount}</span>}
            </button>

            <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 group/btn">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-blue-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-white group-hover/btn:text-blue-400 transition-all" />
              </div>
              {commentsList.length > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{commentsList.length}</span>}
            </button>

            {/* 📤 Native Share Button! */}
            <button onClick={handleShare} className="flex flex-col items-center gap-1 group/btn">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-green-500/20 transition-colors">
                {isCopied ? (
                  <Check className="w-6 h-6 text-green-400 transition-all" />
                ) : (
                  <Share2 className="w-6 h-6 text-white group-hover/btn:text-green-400 transition-all" />
                )}
              </div>
            </button>
                {/* 📥 Native Download Button */}
            <button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="flex flex-col items-center gap-1 group/btn pointer-events-auto"
            >
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-yellow-500/20 transition-colors">
                {isDownloading ? (
                  <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                ) : (
                  <Download className="w-6 h-6 text-white group-hover/btn:text-yellow-400 transition-all" />
                )}
              </div>
            </button>

            {isOwner ? (
              <button onClick={handleDelete} disabled={isDeleting} className="p-2 group/delete mt-1">
                {isDeleting ? <Loader2 className="w-6 h-6 text-red-400 animate-spin" /> : <Trash2 className="w-6 h-6 text-white/80 group-hover/delete:text-red-500 transition-all" />}
              </button>
            ) : (
              <button className="p-2 mt-1">
                <MoreHorizontal className="w-6 h-6 text-white/80 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Comments Modal Overlay (Unchanged) --- */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowComments(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Comments</h3>
              <button onClick={() => setShowComments(false)} className="p-2 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {commentsList.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p>No comments yet. Be the first to start the conversation!</p>
                </div>
              ) : (
                commentsList.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <img 
                      src={comment?.user?.image || `https://ui-avatars.com/api/?name=${comment?.user?.username || 'U'}`} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                    />
                    <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100 flex-1">
                      <span className="font-bold text-sm text-gray-900 block mb-1">
                        @{comment?.user?.username || comment?.user?.name || "anonymous"}
                      </span>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-gray-100 text-gray-900 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()}
                className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${
                  isSubmitting || !commentText.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                }`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}