import { generateResponse } from '../../services/LLM/generativeAI.mjs';
const findMostHarmfulSentence = async (req, res) => {
    const { content } = req.body;

    try {
        // Step 1: Extract the first 10 lines of content
        const lines = content.split("\n").slice(0, 10);
        const joinedLines = lines.join(" ");

        // Step 2: Create a prompt to identify the most harmful sentence
        const harmfulPrompt = `From the following text, identify the single most harmful statement. Return only the sentnce,dont had any more text or explanation. If none are harmful, return the first sentence:
        "${joinedLines}"`;

        // Step 3: Get the response from the LLM
        const harmfulResponse = await generateResponse(harmfulPrompt);
        const mostHarmfulSentence = harmfulResponse.trim();

        // Step 4: Handle invalid or empty response
        if (!mostHarmfulSentence) {
            // Return the first sentence as a fallback
            const firstSentence = joinedLines.split(/[.!?]+/)[0].trim();
            return res.status(200).json({ mostHarmfulSentence: firstSentence });
        }

        // Step 5: Return the identified most harmful sentence
        res.status(200).json({ mostHarmfulSentence });
    } catch (error) {
        console.error("Error finding the most harmful sentence:", error);
        res.status(500).json({ message: "Error processing the content", error: error.message });
    }
};

export { findMostHarmfulSentence };