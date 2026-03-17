import { getPublicUserProfile } from "@/app/actions/user.action";
import ImageCard from "@/app/_components/ImageCard";
import Link from "next/link";
import { ArrowLeft, User as UserIcon } from "lucide-react";

export default async function PublicProfilePage({ params }) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;
  
  const profileData = await getPublicUserProfile(userId);

  if (!profileData || !profileData.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found 🕵️‍♂️</h1>
        <Link href="/" className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all">
          Go back home
        </Link>
      </div>
    );
  }

  const { user, posts } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to feed
        </Link>

        {/* --- Public Profile Header --- */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-50 rounded-full border-4 border-purple-50 flex items-center justify-center overflow-hidden shadow-sm">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
              )}
            </div>
          </div>
          
          <div className="flex-1 mt-2 sm:mt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-purple-600 font-medium mb-3">@{user.username}</p>
            <p className="text-gray-600 max-w-lg leading-relaxed">
              {user.bio || "This user hasn't written a bio yet."}
            </p>
          </div>
        </div>

        {/* --- Public Feed Grid --- */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Public Posts ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No public posts yet. 🌟</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post) => (
                <ImageCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}