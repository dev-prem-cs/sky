"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; 
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Loader2, X, Send } from "lucide-react";
import { deletePost, toggleLike, addComment } from "@/app/actions/post.action"; // 🆕 Import addComment

export default function ImageCard({ post }) {
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

  // 💬 NEW: Commenting State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 💬 NEW: Function to submit a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!session?.user) return alert("Please log in to comment! 💬");
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(post._id, commentText);

    if (result.success) {
      // Instantly push the new comment to the list so it shows up without reloading
      setCommentsList((prev) => [...prev, result.comment]);
      setCommentText(""); // Clear the input
    } else {
      alert(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* --- Main Image Card --- */}
      <div className={`relative w-full h-96 rounded-2xl overflow-hidden group shadow-lg ${isDeleting ? "opacity-50" : ""}`}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 w-full p-4 flex items-end justify-between">
          <div className="flex-1 pr-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <img src={userImage} alt={username} className="w-8 h-8 rounded-full border border-white/50 object-cover" />
              <span className="text-sm font-semibold opacity-90">@{username}</span>
            </div>
            <h3 className="text-lg font-bold leading-tight">{title}</h3>
            <p className="text-xs text-gray-300 line-clamp-2 mt-1">{description}</p>
          </div>

          <div className="flex flex-col gap-4 items-center pb-1">
            <button onClick={handleLike} className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
              <div className={`p-2 backdrop-blur-md rounded-full transition-colors ${isLiked ? "bg-red-500/20" : "bg-white/10 group-hover/btn:bg-red-500/20"}`}>
                <Heart className={`w-6 h-6 transition-all ${isLiked ? "text-red-500 fill-red-500 scale-110" : "text-white group-hover/btn:text-red-500"}`} />
              </div>
              {likesCount > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{likesCount}</span>}
            </button>

            {/* 💬 NEW: Opens the Modal when clicked! */}
            <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-blue-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-white group-hover/btn:text-blue-400 transition-all" />
              </div>
              {commentsList.length > 0 && <span className="text-xs text-white font-medium drop-shadow-md">{commentsList.length}</span>}
            </button>

            <button className="flex flex-col items-center gap-1 group/btn pointer-events-auto">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-green-500/20 transition-colors">
                <Share2 className="w-6 h-6 text-white group-hover/btn:text-green-400 transition-all" />
              </div>
            </button>

            {isOwner ? (
              <button onClick={handleDelete} disabled={isDeleting} className="p-2 pointer-events-auto group/delete mt-1">
                {isDeleting ? <Loader2 className="w-6 h-6 text-red-400 animate-spin" /> : <Trash2 className="w-6 h-6 text-white/80 group-hover/delete:text-red-500 transition-all" />}
              </button>
            ) : (
              <button className="p-2 pointer-events-auto mt-1">
                <MoreHorizontal className="w-6 h-6 text-white/80 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 💬 NEW: The Comments Modal Overaly */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowComments(false)}>
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Comments</h3>
              <button onClick={() => setShowComments(false)} className="p-2 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List (Scrollable) */}
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

            {/* Input Form */}
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