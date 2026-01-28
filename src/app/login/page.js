"use client";

import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        
        {/* --- Header & Toggle --- */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-500 mb-6">
            {isLogin 
              ? "Enter your details to access your account." 
              : "Sign up to start sharing your moments."}
          </p>

          {/* Toggle Switch */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* --- Form Section --- */}
        <form className="px-8 pb-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Name Field (Sign Up Only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Forgot Password (Login Only) */}
          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <Link href="/" className="block"> {/* Using Link to simulate successful login redirect */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 mt-2">
              {isLogin ? "Log In" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </form>

        {/* --- Divider --- */}
        <div className="relative px-8 py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 mx-8"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* --- Social Buttons --- */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Github className="w-5 h-5 text-gray-900" />
            <span className="text-sm font-medium text-gray-700">GitHub</span>
          </button>
        </div>

      </div>
    </div>
  );
}