"use client";

import Link from "next/link";
import { Home, Search, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[white] border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        
        {/* Home Tab */}
        <Link
          href="/"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
        >
          <Home className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="text-xs text-gray-500 group-hover:text-blue-600">
            Home
          </span>
        </Link>

        {/* Search Tab */}
        <Link
          href="/search"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
        >
          <Search className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="text-xs text-gray-500 group-hover:text-blue-600">
            Search
          </span>
        </Link>

        {/* Profile Tab */}
        <Link
          href="/profile"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
        >
          <User className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="text-xs text-gray-500 group-hover:text-blue-600">
            Profile
          </span>
        </Link>

      </div>
    </div>
  );
}