import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from token.env file
dotenv.config({ path: "../server/token.env" });
console.log("Loaded API Key:", process.env.GEMINI_API_KEY); // Log the API Key
const apiKey = process.env.GEMINI_API_KEY; // Access API key from environment variables

// Throw an error if API key is not found
if (!apiKey) {
  throw new Error("API key is missing! Please add GEMINI_API_KEY to token.env.");
}

// Initialize GoogleGenerativeAI instance with API key
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model (gemini-1.5-flash)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate response from the model
async function generateResponse(prompt) {
  try {
    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    console.log(result.response.text()); // Log the generated text
    return result.response.text(); // Return the generated text
  }
  catch (error) {
    console.error("Error generating content:", error); // Log error if generation fails
    throw error; // Throw error to be caught by caller
  }
}

// Export the generateResponse function for use in other modules
export { generateResponse };
