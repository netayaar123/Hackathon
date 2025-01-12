import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA4KvH0d4rPdu7fdqziqJX6_-bC7omAJnk");

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
  //use this in prompt to generate response 