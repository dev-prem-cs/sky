"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div>
        <h3>Welcome, {session.user?.name}! 🎉</h3>
        <p>Email: {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h3>You are not logged in. 🛑</h3>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
}