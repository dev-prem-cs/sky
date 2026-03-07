import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 🚨 Notice the function is now called 'proxy' instead of 'middleware'
export async function proxy(req) {
  const path = req.nextUrl.pathname;

  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" || 
    path.startsWith("/api/auth") ||
    path.startsWith("/api/register");

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if ((path === "/" || path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
