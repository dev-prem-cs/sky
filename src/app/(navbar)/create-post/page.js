"use client";

import { generateTagsFromImage } from "@/app/actions/ai.action";
import { Sparkles, Loader2 } from "lucide-react"; // Grab the sparkles icon!

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { upload } from "@imagekit/next";
import { X } from "lucide-react"; 

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // 🆕 ADD THIS LINE
  // const [tags, setTags] = useState("");
  const [tags, setTags] = useState([]); 
  const [tagInput, setTagInput] = useState("");
  // ai tagging
const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [visibility, setVisibility] = useState("public"); 
  const [imageId, setImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  
  // 🆕 NEW: State to control our success toast!
  const [showToast, setShowToast] = useState(false);

  if (status === "loading") return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit");
      if (!response.ok) throw new Error("Failed to authenticate with ImageKit");
      return await response.json();
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadingImage(true);
    setError("");

    try {
      const { signature, expire, token } = await authenticator();
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        signature,
        token,
        expire,
        publicKey,
      });

      setImageUrl(uploadResponse.url);
      setImageId(uploadResponse.fileId);
    } catch (err) {
      console.error(err);
      setError("Failed to upload the image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

// 🎯 3. Handle key presses to create tags
  const handleKeyDown = (e) => {
    // Listen for Enter or Comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Stop the form from submitting!
      
      const newTag = tagInput.trim().toLowerCase();
      
      // Make sure it's not empty and not already in the array
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput(""); // Clear the input field
    }
  };

  // 🎯 4. Handle clicking the "X" to remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          desc, 
          image_url: imageUrl, 
          image_file_id: imageId,
          meta_tags: tags,
          visibility 
        }),
      });

      if (res.ok) {
        // 🎯 1. Trigger the toast!
        setShowToast(true);
        
        // 🎯 2. Wait for 1.5 seconds so they can see the success message, THEN redirect!
        setTimeout(() => {
          router.push("/");
        }, 1500);
        
      } else {
        const data = await res.json();
        setError(data.message);
        setLoading(false); // Only reset loading if there is an error
      }
    } catch (err) {
      setError("An error occurred while creating the post.");
      setLoading(false);
    } 
  };

// ai tagging function 
const handleAutoTag = async () => {
    if (!selectedFile) {
      return alert("Please select an image first so the AI can analyze it! 🖼️");
    }

    setIsGeneratingTags(true);

    try {
      // 1. Convert the image file to a Base64 string so we can send it to the server
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        // 2. Call our Gemini Server Action
        const result = await generateTagsFromImage(base64String);
        
        if (result.success) {
          // 3. Merge the AI tags with any tags the user already typed, removing duplicates!
          const combinedTags = [...new Set([...tags, ...result.tags])];
          setTags(combinedTags);
        } else {
          alert("Could not generate tags. Please try manually.");
        }
        setIsGeneratingTags(false);
      };
    } catch (error) {
      console.error(error);
      setIsGeneratingTags(false);
    }
  };


  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", position: "relative" }}>
      
      {/* 🆕 NEW: The Toast UI */}
      {showToast && (
        <div style={{
          position: "absolute",
          top: "-20px",
          left: "50%",
          transform: "translate(-50%, -100%)",
          backgroundColor: "#10B981", // Beautiful Emerald Green
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "slideDown 0.3s ease-out forwards",
          zIndex: 50
        }}>
          ✅ Post uploaded successfully!
        </div>
      )}

      <h2>Create a New Post ✍️</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>Posting as: <strong>{session?.user?.name || session?.user?.username}</strong></p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <input 
          type="text" 
          placeholder="Post Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        <textarea 
          placeholder="What's on your mind?" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          rows="5"
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>Attach an Image (Optional) 🖼️</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", background: "#f9f9f9" }}
          />
          
          {uploadingImage && <p style={{ fontSize: "13px", color: "#666", margin: "0" }}>Uploading to ImageKit... ⏳</p>}
          
          {imageUrl && (
            <div style={{ marginTop: "10px", position: "relative" }}>
              <p style={{ fontSize: "13px", color: "green", margin: "0 0 5px 0" }}>✅ Image ready!</p>
              <img 
                src={imageUrl} 
                alt="Uploaded preview" 
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }} 
              />
            </div>
          )}
        </div>

        {/* 🎯 5. The Interactive Tag Input Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: "bold", fontSize: "14px" }}>Tags 🏷️</label>
            
            <button
              type="button"
              onClick={handleAutoTag}
              disabled={isGeneratingTags || !selectedFile} // Assuming 'file' holds your image
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: isGeneratingTags ? "#E5E7EB" : "#F3E8FF", // Purple tint
                color: isGeneratingTags ? "#9CA3AF" : "#9333EA",
                border: "none",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: isGeneratingTags || !selectedFile ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              {isGeneratingTags ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isGeneratingTags ? "Analyzing..." : "Auto-Tag"}
            </button>
          </div>
          
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "8px", 
            padding: "10px", 
            borderRadius: "4px", 
            border: "1px solid #ccc", 
            backgroundColor: "#fff",
            alignItems: "center"
          }}>
            
            {/* Map out the existing tags as little pills */}
            {tags.map((tag, index) => (
              <span 
                key={index} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#E0E7FF", // Light Indigo
                  color: "#4338CA", // Dark Indigo
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}
              >
                #{tag}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0", display: "flex", color: "#4338CA" }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* The actual input field */}
            <input 
              type="text" 
              placeholder={tags.length === 0 ? "Type a tag and press Enter or Comma..." : ""}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ 
                border: "none", 
                outline: "none", 
                flex: 1, 
                minWidth: "120px",
                fontSize: "14px",
                backgroundColor: "transparent"
              }}
            />
          </div>
          <p style={{ fontSize: "12px", color: "#666", margin: "0" }}>Press Enter or comma to add a tag.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="visibility" style={{ fontWeight: "bold", fontSize: "14px" }}>Post Visibility 👁️</label>
          <select 
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            style={{ 
              padding: "10px", 
              borderRadius: "4px", 
              border: "1px solid #ccc", 
              backgroundColor: "#fff",
              cursor: "pointer" 
            }}
          >
            <option value="public">🌍 Public (Everyone can see)</option>
            <option value="private">🔒 Private (Only you can see)</option>
          </select>
        </div>

        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading || uploadingImage || showToast} 
          style={{ 
            padding: "12px", 
            backgroundColor: (loading || uploadingImage || showToast) ? "#ccc" : "#000", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px",
            cursor: (loading || uploadingImage || showToast) ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          {loading ? "Publishing..." : showToast ? "Redirecting..." : "Publish Post"}
        </button>

      </form>
      
      {/* Optional: Add a quick keyframe for the slide-down animation right in the component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -150%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }
      `}} />
    </div>
  );
}