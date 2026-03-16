import React from 'react';
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";
import Image from "next/image"; 

const LandingPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    // 1. Updated base background color to a very pale blue
    <div className="relative min-h-screen bg-[#f4f9ff] flex items-center justify-center p-4 sm:p-6 overflow-hidden z-0">

      {/* 2. Enhanced Decorative Background (The "Mesh Gradient") */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        
        {/* Top-Left Cyan/Blue sweeping blob */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-cyan-200/50 blur-[120px] mix-blend-multiply"></div>
        
        {/* Center-Right Soft Purple blob */}
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] rounded-full bg-purple-200/40 blur-[150px] mix-blend-multiply"></div>
        
        {/* Bottom-Left deep blue support blob */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-300/30 blur-[130px] mix-blend-multiply"></div>
        
        {/* Bottom-Right Cyan/Teal blob */}
        <div className="absolute -bottom-[10%] right-[0%] w-[50%] h-[50%] rounded-full bg-teal-200/40 blur-[120px] mix-blend-multiply"></div>

        {/* 3. SVG Pattern Overlay (Optional but recommended for the exact look)
          If you export the wavy lines as an SVG, you can apply it here using a background image class or an inline <img>.
        */}
        <div className="absolute inset-0 opacity-30 bg-[url('/path-to-your-wavy-lines.svg')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      {/* Main Glassmorphism Card (Kept mostly the same, adjusted border/bg for clarity against new background) */}
      <div className="w-full max-w-6xl rounded-2xl md:rounded-3xl backdrop-blur-xl bg-white/50 shadow-2xl border border-white/60 p-6 sm:p-8 md:p-10 relative z-10">

        {/* Navbar */}
        <nav className="flex flex-wrap justify-between items-center gap-4 mb-10 md:mb-16">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Sky-It</h1>

          <div className="flex gap-3 md:gap-4">
            <Link href="/login" className="px-5 py-2 text-sm md:text-base rounded-full border border-blue-600 text-blue-600 font-medium transition-all hover:bg-blue-50">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm md:text-base rounded-full bg-blue-600 text-white font-medium shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]">
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 leading-tight pb-2">
            Capture, Store, & Share <br className="hidden sm:block" />
            Your World in the Cloud
          </h2>
        </div>

        {/* Mockup Area (Placeholder for now) */}
        {/* Mockup Area */}
        <div className="relative mx-auto w-full max-w-5xl mt-12 md:mt-20 px-2 sm:px-4 pb-10">
          
          {/* 3D Transform Container */}
          <div className="group relative transition-transform duration-700 ease-out [transform:perspective(2000px)_rotateX(12deg)_scale(0.9)] hover:[transform:perspective(2000px)_rotateX(0deg)_scale(1)]">
            
            {/* Ambient Glow behind the image */}
            <div className="absolute inset-0 bg-blue-400 blur-[80px] opacity-20 -z-10 rounded-3xl transition-opacity duration-700 group-hover:opacity-40"></div>
            
            {/* The Image Itself */}
           <Image 
              src='/Capture.PNG'
              alt="Sky-It Dashboard Mockup" 
              width={1200} // ⚠️ Replace with your image's actual width
              height={800} // ⚠️ Replace with your image's actual height
              priority // 🚀 Add this because the image is "above the fold" (visible immediately)
              className="w-full h-auto rounded-[20px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-white/50 bg-white/50 backdrop-blur-sm"
            />
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default LandingPage;