"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateTagsFromImage(base64Image) {
  try {
    // 1. Initialize Gemini using your environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // We use gemini-1.5-flash because it is lightning fast and great with images
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Strict prompt to ensure we only get a clean list of words
    const prompt = "Analyze this image and provide exactly 5 relevant, descriptive, single-word tags for a social media post. Return ONLY a comma-separated list of words in lowercase. No explanation, no hashtags.";

    // 3. Format the base64 string for the API
    // We split off the "data:image/jpeg;base64," prefix that browsers generate
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.match(/data:(.*?);base64/)[1];

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ];

    // 4. Call the AI
    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    // 5. Clean up the AI response into a neat array
    const generatedTags = responseText
      .split(",")
      .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9]/g, "")) // Remove special chars
      .filter(tag => tag.length > 0);

    return { success: true, tags: generatedTags };
  } catch (error) {
    console.error("AI Tag Generation failed:", error);
    return { success: false, message: "Failed to generate tags" };
  }
}