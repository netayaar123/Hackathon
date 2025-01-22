import { generateResponse } from '../../services/LLM/generativeAI.mjs';
const findMostHarmfulSentence = async (req, res) => {
    const { content } = req.body;

    try {
        const lines = content.split("\n").slice(0, 10);
        const joinedLines = lines.join(" ");

        const harmfulPrompt = `From the following text, identify the single most harmful statement. Return only the sentnce,dont had any more text or explanation. If none are harmful, return the first sentence:
        "${joinedLines}"`;

        const harmfulResponse = await generateResponse(harmfulPrompt);
        const mostHarmfulSentence = harmfulResponse.trim();

        if (!mostHarmfulSentence) {
            const firstSentence = joinedLines.split(/[.!?]+/)[0].trim();
            return res.status(200).json({ mostHarmfulSentence: firstSentence });
        }

        res.status(200).json({ mostHarmfulSentence });
    } catch (error) {
        console.error("Error finding the most harmful sentence:", error);
        res.status(500).json({ message: "Error processing the content", error: error.message });
    }
};

export { findMostHarmfulSentence };