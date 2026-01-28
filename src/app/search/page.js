"use client";

import { useState } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import ImageCard from "../_components/ImageCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  // Mock data to simulate search results
  const allPosts = [
    { id: 1, title: "Neon City", username: "cyber_junkie", imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a" },
    { id: 2, title: "Mountain Peak", username: "hiker_pro", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
    { id: 3, title: "Cozy Coffee", username: "barista_daily", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },
    { id: 4, title: "Gaming Setup", username: "tech_guru", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
    { id: 5, title: "Ocean View", username: "travel_addict", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  ];

  // Filter posts based on search query
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* --- Top Sticky Search Bar --- */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-4">
        <div className="relative">
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Input Field */}
          <input
            type="text"
            placeholder="Search for tags, people, or places..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-900 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
          />

          {/* Clear Button (only shows when typing) */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-4">
        
        {/* State 1: Search is Empty (Show Recent/Trending) */}
        {query === "" ? (
          <div className="space-y-6">
            
            {/* Recent Searches Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Recent
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Minimalist Design", "React.js", "Tokyo Travel"].map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => setQuery(tag)} // Click to quick search
                    className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 hover:bg-gray-100"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" /> Trending Now
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">#Gaming</div>
                <div className="h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">#Foodie</div>
              </div>
            </div>
            
          </div>
        ) : (
          /* State 2: User is Typing (Show Results) */
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Found {filteredPosts.length} result{filteredPosts.length !== 1 && "s"}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <ImageCard 
                    key={post.id}
                    title={post.title}
                    username={post.username}
                    imageUrl={post.imageUrl}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}