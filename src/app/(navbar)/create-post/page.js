"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { upload } from "@imagekit/next"; // 🆕 Import ImageKit upload utility

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // 🆕 Track image upload status
  const [error, setError] = useState("");

  if (status === "loading") return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  // 🆕 Function to fetch auth params securely from our API route
  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit");
      if (!response.ok) throw new Error("Failed to authenticate with ImageKit");
      return await response.json();
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  // 🆕 Handle the actual file upload to ImageKit
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      // 1. Get the signature and token from our backend
      const { signature, expire, token } = await authenticator();
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

      // 2. Upload to ImageKit directly from the browser
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        signature,
        token,
        expire,
        publicKey,
      });

      // 3. Save the returned URL to our form state!
      setImageUrl(uploadResponse.url);
    } catch (err) {
      console.error(err);
      setError("Failed to upload the image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
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
          meta_tags: tags 
        }),
      });

      if (res.ok) {
        router.push("/"); // 🎉 Success!
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
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

        {/* 🆕 Replaced Text Input with File Upload Input */}
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
          
          {/* 🆕 Show a nice little preview once the upload finishes */}
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

        <input 
          type="text" 
          placeholder="Tags (comma separated, e.g. code, tutorial, nextjs)" 
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading || uploadingImage} // Prevent submitting while an image is uploading!
          style={{ 
            padding: "12px", 
            backgroundColor: (loading || uploadingImage) ? "#ccc" : "#000", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px",
            cursor: (loading || uploadingImage) ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>

      </form>
    </div>
  );
}