import ImageKit from "imagekit";
import { NextResponse } from "next/server";

// Initialize ImageKit securely on the server
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function GET() {
  try {
    // Generates { token, expire, signature }
    const result = imagekit.getAuthenticationParameters(); 
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "ImageKit Auth Failed" }, { status: 500 });
  }
}