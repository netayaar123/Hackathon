import { generateResponse } from '../../services/LLM/generativeAI.mjs';

// Function to find the most harmful sentence in the provided content
const findMostHarmfulSentence = async (req, res) => {
    const { content } = req.body;

    try {
        // Step 1: Split the content into lines and join the first 10 lines
        const lines = content.split("\n").slice(0, 10);
        const joinedLines = lines.join(" ");

        // Step 2: Create a harmful prompt to identify the most harmful sentence
        const harmfulPrompt = `From the following text, identify the single most harmful statement. Return only the sentnce,dont had any more text or explanation. If none are harmful, return the first sentence:
        "${joinedLines}"`;

        // Step 3: Send the prompt to the LLM and get the harmful sentence response
        const harmfulResponse = await generateResponse(harmfulPrompt);
        const mostHarmfulSentence = harmfulResponse.trim();

        // Step 4: Return the first sentence if no harmful sentence is found
        if (!mostHarmfulSentence) {
            const firstSentence = joinedLines.split(/[.!?]+/)[0].trim();
            return res.status(200).json({ mostHarmfulSentence: firstSentence });
        }

        // Step 5: Return the most harmful sentence found
        res.status(200).json({ mostHarmfulSentence });
    } catch (error) {
        console.error("Error finding the most harmful sentence:", error);
        // Step 6: Return error response if there's an issue with the process
        res.status(500).json({ message: "Error processing the content", error: error.message });
    }
};

export { findMostHarmfulSentence };