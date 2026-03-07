"use client";

import { useState, useEffect } from "react";
import { Search, X, TrendingUp, Clock, Loader2, Trash2 } from "lucide-react";
import ImageCard from "../../_components/ImageCard"; 
import { searchPosts } from "@/app/actions/post.action"; 

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false); 
  
  // 🆕 State to hold our dynamic recent searches
  const [recentSearches, setRecentSearches] = useState([]);

  // 🎯 1. Load recent searches from localStorage when the page first loads
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // 🎯 2. Helper function to add a new search term to the list
  const addToRecent = (term) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setRecentSearches((prev) => {
      // Remove the term if it already exists (so we don't get duplicates)
      const filtered = prev.filter((t) => t.toLowerCase() !== cleanTerm.toLowerCase());
      // Add the new term to the front, and keep only the last 5 searches
      const updated = [cleanTerm, ...filtered].slice(0, 5);
      
      // Save the updated list back to the browser's storage
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  // 🎯 3. Helper to clear the history
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Debounce Effect
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      // 🆕 Save the query to recent searches right before we fetch!
      addToRecent(query);
      
      const fetchedPosts = await searchPosts(query);
      setResults(fetchedPosts);
      setIsSearching(false);
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* --- Top Sticky Search Bar --- */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search for tags, people, or places..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 text-gray-900 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-black/50 transition-all placeholder:text-gray-500"
          />

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
      <div className="p-4 max-w-7xl mx-auto">
        
        {/* State 1: Search is Empty */}
        {query === "" ? (
          <div className="space-y-6">
            
            {/* 🆕 Dynamic Recent Searches Section */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" /> Recent
                  </h3>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((tag) => (
                    <button 
                      key={tag} 
                      onClick={() => setQuery(tag)} 
                      className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" /> Trending Now
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  onClick={() => setQuery("Gaming")}
                  className="h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  #Gaming
                </div>
                <div 
                  onClick={() => setQuery("Food")}
                  className="h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  #Food
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          /* State 2: User is Typing (Show Results) */
          <div>
            {isSearching ? (
              <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching database...
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Found {results.length} result{results.length !== 1 && "s"}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.length > 0 ? (
                    results.map((post) => (
                      <ImageCard key={post._id} post={post} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-gray-400">
                      No results found for "{query}". Try a different keyword!
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}