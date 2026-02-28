"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState(""); // We'll let them type comma-separated tags
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If NextAuth is still figuring out if they are logged in, show a loading state
  if (status === "loading") return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

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
        // 🎉 Success! Redirect them to the homepage to see their new post
        router.push("/");
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

        <input 
          type="text" 
          placeholder="Image URL (Optional)" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

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
          disabled={loading}
          style={{ 
            padding: "12px", 
            backgroundColor: loading ? "#ccc" : "#000", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>

      </form>
    </div>
  );
}