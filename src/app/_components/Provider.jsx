"use client";

import { SessionProvider } from "next-auth/react";

// Add the { } around children to destructure the props! 👇
export const Providers = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};