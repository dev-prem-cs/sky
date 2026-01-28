"use client";

import { useState } from "react";
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("public");

  const tabs = [
    { id: "public", label: "Public", icon: Globe },
    { id: "private", label: "Private", icon: Lock },
    { id: "search", label: "Search", icon: Search },
  ];

  // Mock data for the grid items
  const gridItems = [
    { id: 1, color: "bg-pink-300", icon: "🌸" },
    { id: 2, color: "bg-orange-300", icon: "🌅" },
    { id: 3, color: "bg-teal-300", icon: "🌿" },
    { id: 4, color: "bg-blue-300", icon: "🌊" },
    { id: 5, color: "bg-purple-300", icon: "🦋" },
    { id: 6, color: "bg-fuchsia-300", icon: "🌺" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="max-w-4xl mx-auto p-6">
        
        {/* --- Profile Header Card --- */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar & Status */}
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 rounded-2xl border-2 border-purple-100 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-blue-400" />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-4 border-white"></div>
            </div>
            
            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alexandra Chen</h1>
              <p className="text-gray-500 max-w-md mt-1">
                Creative designer & photographer. Capturing moments that matter ✨
              </p>
            </div>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- Tab Navigation --- */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
                  ${isActive 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-200"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-3 gap-6">
          {gridItems.map((item) => (
            <div 
              key={item.id}
              className={`${item.color} aspect-square rounded-3xl flex items-center justify-center text-5xl shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
              {item.icon}
            </div>
          ))}
        </div>

      </div>
      
      {/* --- Floating Action Button (FAB) --- */}
      <button className="fixed right-6 bottom-24 z-20 p-4 bg-purple-600 rounded-2xl shadow-lg hover:bg-purple-700 transition-colors">
        <Plus className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}