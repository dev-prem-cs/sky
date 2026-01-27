"use client";

// You can fetch this from an API or leave it hardcoded
const categories = [
  "All",
  "APIs",
  "Music",
  "Data Structures",
  "CSS",
  "Google",
  "Mixes",
  "Podcasts",
  "Gaming",
  "Eren Yeager",
];

export default function CategoryPills() {
  return (
    // 'sticky top-0' keeps it visible while scrolling down the page
    <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-100">
      
      {/* Container for scrolling */}
      <div className="flex overflow-x-auto whitespace-nowrap p-4 space-x-3 scrollbar-hide">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors 
              ${
                // Style the first item ('All') as active
                index === 0
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}