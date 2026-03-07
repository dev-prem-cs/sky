import React from 'react';
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const LandingPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 flex items-center justify-center p-4 sm:p-6 overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 md:top-10 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-blue-300 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 md:bottom-20 md:right-20 w-56 md:w-80 h-56 md:h-80 bg-purple-300 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-6xl rounded-2xl md:rounded-3xl backdrop-blur-xl bg-white/40 shadow-2xl border border-white/30 p-6 sm:p-8 md:p-10">

        {/* Navbar */}
        <nav className="flex flex-wrap justify-between items-center gap-4 mb-10 md:mb-16">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Sky-It</h1>

          <div className="flex gap-3 md:gap-4">
            <Link href="/login" className="px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base rounded-full border border-blue-500 text-blue-600 transition-colors hover:bg-blue-50">
              Login
            </Link>
            <Link href="/register" className="px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base rounded-full bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Capture, Store & Share <br className="hidden sm:block" />
            Your World in the Cloud
          </h2>
        </div>

        {/* Mockup Area */}
        <div className="relative mx-auto max-w-4xl rounded-2xl md:rounded-3xl bg-white/60 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            
            {/* Mockup Sidebar / Mobile Top-bar */}
            <div className="w-full md:w-16 flex flex-row md:flex-col gap-4 md:gap-6 items-center justify-center md:justify-start">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl shrink-0"></div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg md:rounded-xl shrink-0"></div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg md:rounded-xl shrink-0"></div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200/80 h-28 sm:h-32 md:h-40 rounded-xl md:rounded-2xl w-full"></div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;
