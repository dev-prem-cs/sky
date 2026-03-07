import { Suspense } from "react"; // 🆕 Import Suspense
import CategoryPills from "@/app/_components/CategoryPills";
import FeedList from "@/app/_components/FeedList";
import { fetchPosts, fetchTags } from "@/app/actions/post.action";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const currentTag = params?.tag || "All";
  
  const [initialPosts, tags] = await Promise.all([
    fetchPosts(1, 5, currentTag),
    fetchTags()
  ]);
  
  return (
    <main className="min-h-screen pb-24 bg-gray-50"> 
      
      {/* 🎯 Wrap the pills in Suspense to prevent Next.js router freezes! */}
      <Suspense fallback={<div className="p-4 text-center">Loading categories...</div>}>
        <CategoryPills tags={tags} />
      </Suspense>

      <div className="p-4 max-w-7xl mx-auto w-full">
        <FeedList initialPosts={initialPosts} currentTag={currentTag} />
      </div>

    </main>
  );
}