"use client";

import ImageCard from "./ImageCard";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { fetchPosts } from "../actions/post.action";

// 🆕 Accept currentTag as a prop
export default function FeedList({ initialPosts, currentTag }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 5);
  
  const { ref, inView } = useInView();

  // 🎯 CRITICAL FIX: Watch for changes to the URL tag or initial posts.
  // If the user clicks a new category pill, reset the state entirely!
  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(initialPosts.length >= 5);
  }, [initialPosts, currentTag]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMorePosts();
    }
  }, [inView, hasMore]); // Added hasMore to dependency array for safety

  const loadMorePosts = async () => {
    const nextPageIndex = page + 1;
    
    // 🆕 Pass the currentTag so infinite scroll fetches the right category!
    const newPosts = await fetchPosts(nextPageIndex, 5, currentTag);

    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage(nextPageIndex);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      {posts.length === 0 ? (
        <div className="text-center p-10 text-gray-500 w-full">
          No posts found for "{currentTag}". Be the first to post! 🌟
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {posts.map((post) => (
            <ImageCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div ref={ref} className="text-center p-5 text-gray-500 w-full">
          Loading more posts... ⏳
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <p className="text-center p-5 text-gray-500 w-full">
          You've caught up! No more posts to show. 🎉
        </p>
      )}
      
    </div>
  );
}