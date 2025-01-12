import { GoogleGenerativeAI } from "@google/generative-ai";
//import { generateTypePrompt, generateFactVerificationPrompt, generateOpinionOrLiePrompt } from "../controllers/promptBuilder.js";

const genAI = new GoogleGenerativeAI("AIzaSyA4KvH0d4rPdu7fdqziqJX6_-bC7omAJnk");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "is the sky green?";

const result = await model.generateContent(prompt);
console.log(result.response.text());