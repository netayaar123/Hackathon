import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load the `token.env` file
dotenv.config({ path: "./server/token.env" });
// Debug log to check if the API key is loaded
console.log("Loaded API Key:", process.env.GEMINI_API_KEY);

// Access the API key from the .env file
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API key is missing! Please add GEMINI_API_KEY to token.env.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateResponse(prompt) {
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  }
  catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export { generateResponse };
