"use client";


import { upload } from "@imagekit/next";
import { updateUserProfile } from "@/app/actions/post.action";
import { X, Camera, Loader2 } from "lucide-react"; // We need a few more icons

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  User, 
  Edit, 
  Settings, 
  Globe, 
  Lock, 
  Search, 
  Plus 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ImageCard from "../../_components/ImageCard"; 
import { fetchUserPosts } from "@/app/actions/post.action"; 

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("public");
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [userPosts, setUserPosts] = useState([]);


  //profile image logic start
// ✏️ Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageId, setNewImageId] = useState("");

  // 🎯 ImageKit Authenticator (Same as CreatePost!)
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit");
      if (!response.ok) throw new Error("Failed to authenticate with ImageKit");
      return await response.json();
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  // 📸 Handle Image Upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { signature, expire, token } = await authenticator();
      const uploadResponse = await upload({
        file,
        fileName: `profile_${session?.user?.id}`,
        signature,
        token,
        expire,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      });

      setNewImageUrl(uploadResponse.url);
      setNewImageId(uploadResponse.fileId);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // 💾 Save the Profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    const result = await updateUserProfile(bioInput, newImageUrl, newImageId);
    
    if (result.success) {
      setShowEditModal(false);
      // Optional: Force a hard reload to sync NextAuth's session image
      window.location.reload(); 
    } else {
      alert(result.message);
    }
    setIsSaving(false);
  };
  //profile image logic end 

  const tabs = [
    { id: "public", label: "Public", icon: Globe },
    { id: "private", label: "Private", icon: Lock },
    { id: "search", label: "Search", icon: Search },
  ];

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserPosts(session.user.id).then(setUserPosts);
    }
  }, [session, status]);

  const filteredSearchPosts = userPosts.filter((post) => {
    if (!searchQuery) return false; 
    
    const lowerQuery = searchQuery.toLowerCase();
    
    const matchesTitle = post.title?.toLowerCase().includes(lowerQuery);
    const matchesDesc = post.desc?.toLowerCase().includes(lowerQuery);
    const matchesTags = post.meta_tags?.some(tag => tag.toLowerCase().includes(lowerQuery));

    return matchesTitle || matchesDesc || matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="max-w-4xl mx-auto p-4 sm:p-6"> 
        
        {/* --- Profile Header Card --- */}
        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6 mb-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-0 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-2xl border-2 border-purple-100 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-4 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{session?.user?.name || "User"}</h1>
              <p className="text-sm md:text-base text-gray-500 max-w-md mt-1">
                {session?.user?.bio || "No bio yet..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 mt-2 md:mt-0">
            <button 
              onClick={() => setShowEditModal(true)} 
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => signOut()} 
              className="p-2 font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* --- Tab Navigation --- */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 sm:mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all
                  ${isActive 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-200"
                  }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- Content Grid --- */}
        {activeTab !== "search" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
            {userPosts
              .filter((post) => (post.visibility || "public") === activeTab)
              .map((post) => (
                <ImageCard key={post._id} post={post} />
              ))}
              
            {userPosts.filter((post) => (post.visibility || "public") === activeTab).length === 0 && (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-10 sm:py-20 text-gray-400">
                No {activeTab} posts found.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your posts by title, tag, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-full py-2 sm:py-3 pl-10 sm:pl-12 pr-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm"
              />
            </div>

            {searchQuery.trim() === "" ? (
              <div className="text-center py-10 sm:py-20 text-gray-400">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-sm sm:text-base">Type above to search through your public and private posts.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Responsive Grid for Search Results */}
                {filteredSearchPosts.length > 0 ? (
                  filteredSearchPosts.map((post) => (
                    <ImageCard key={post._id} post={post} />
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-10 sm:py-20 text-gray-400 text-sm sm:text-base">
                    No posts found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
            
          </div>
        )}

      </div>
      {/* --- Edit Profile Modal --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-3 group cursor-pointer">
                {newImageUrl || session?.user?.image ? (
                  <img src={newImageUrl || session?.user?.image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 text-purple-600 animate-spin" /> : <Camera className="w-8 h-8 text-white drop-shadow-md" />}
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePicUpload} 
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              <p className="text-xs text-gray-500">Tap to upload new picture</p>
            </div>

            {/* Bio Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Bio</label>
              <textarea 
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Tell the world about yourself..."
                maxLength={160}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{bioInput.length}/160</p>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving || isUploading}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors ${
                isSaving || isUploading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
              }`}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isSaving ? "Saving..." : "Save Profile"}
            </button>

          </div>
        </div>
      )}
      <Link href="/create-post" className="fixed right-4 bottom-20 sm:right-6 sm:bottom-24 z-20 p-3 sm:p-4 bg-purple-600 rounded-2xl shadow-lg hover:bg-purple-700 transition-colors">
        <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </Link>
    </div>
  );
}