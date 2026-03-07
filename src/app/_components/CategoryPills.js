"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CategoryPills({ tags = [] }) {
  const router = useRouter();
  const pathname = usePathname(); // 🆕 Gets the exact current page path (e.g., "/home")
  const searchParams = useSearchParams(); 
  
  const currentTag = searchParams.get("tag") || "All";

  const handleTagClick = (tag) => {
    // 1. Copy the current URL parameters safely
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Add or remove the tag
    if (tag === "All") {
      params.delete("tag"); 
    } else {
      params.set("tag", tag);
    }

    // 3. Push the new URL dynamically (e.g., "/home?tag=CSS")
    // { scroll: false } prevents the screen from jarringly jumping to the top!
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="flex gap-3 overflow-x-auto p-4 max-w-7xl mx-auto scrollbar-hide">
        
        <button 
          onClick={() => handleTagClick("All")}
          className={`px-5 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${
            currentTag === "All" 
              ? "bg-black text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        
        {tags.map((tag, index) => (
          <button 
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`px-5 py-2 rounded-lg whitespace-nowrap text-sm font-semibold capitalize transition-all ${
              currentTag === tag 
                ? "bg-black text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}

      </div>
    </div>
  );
}