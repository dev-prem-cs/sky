"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // 🆕 Import the signIn function!

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create an Account 🚀</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input 
          type="text" 
          placeholder="Unique Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "red", fontSize: "14px", margin: "0" }}>{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "10px", 
            backgroundColor: loading ? "#ccc" : "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      {/* 🆕 Visual Divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
        <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>OR</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
      </div>

      {/* 🆕 The Google Sign Up Button */}
      <button 
        onClick={() => signIn("google", { callbackUrl: "/" })} 
        style={{ 
          width: "100%",
          padding: "10px", 
          backgroundColor: "#fff", 
          color: "#333", 
          border: "1px solid #ccc", 
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" style={{ width: "20px" }} />
        Continue with Google
      </button>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
        Already have an account? <Link href="/login" style={{ color: "#0070f3" }}>Login here</Link>
      </p>
    </div>
  );
}
