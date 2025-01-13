import { generateResponse } from '../server/LLM/main.mjs';

const verifyAndClassifyContent = async (req, res) => {
    const { content } = req.body;

    try {
        // Create a single prompt to handle the user request
        const classificationPrompt = `Classify the following statement as either "truth", "lie", "opinion", or "none". Only respond with one word: lie, truth, opinion, or none. Statement: ${content}`;

        // Call the LLM to generate a classification response
        const classificationResponse = await generateResponse(classificationPrompt);

        // Parse the classification response
        let classification = classificationResponse.trim().toLowerCase();

        // Create a prompt to ask for confidence in the classification
        const confidencePrompt = `On a scale of 0-100, how confident are you in classifying the following statement as ${classification}? Only respond with a number: ${content}`;

        // Call the LLM to generate a confidence response
        const confidenceResponse = await generateResponse(confidencePrompt);

        // Parse the confidence response and convert it to a number
        const confidence = parseInt(confidenceResponse.trim(), 10);

        // If confidence is less than 60, reclassify as "none"
        if (isNaN(confidence) || confidence < 60) {
            classification = "none";
        }

        // Prepare the user-facing message based on the classification
        let userMessage;
        if (classification === "truth") {
            userMessage = "The statement is classified as truth.";
        } else if (classification === "lie") {
            userMessage = "The statement is classified as a lie.";
        } else if (classification === "opinion") {
            userMessage = "The statement is classified as an opinion.";
        } else if (classification === "none") {
            userMessage = "The statement could not be classified or confidence was too low.";
        } else {
            userMessage = "Unable to classify the statement. Please try again.";
        }

        // Send the response back to the client
        res.status(200).json({ classification, confidence, message: userMessage });
    } catch (error) {
        res.status(500).json({ message: "Error verifying or classifying content", error });
    }
};

export { verifyAndClassifyContent };
