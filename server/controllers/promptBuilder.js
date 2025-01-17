import { generateResponse } from '../LLM/main.mjs';
import { getContactInfoByCategory } from '../../Database/database.js';

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
        const confidencePrompt = `On a scale of 0 - 100, how confident are you in classifying the following statement as ${classification}? Only respond with a number. Statement: ${content}`;

        // Call the LLM to generate a confidence response
        const confidenceResponse = await generateResponse(confidencePrompt);

        // Parse the confidence response and convert it to a number
        const confidence = parseInt(confidenceResponse.trim(), 10);

        // If confidence is less than 60, reclassify as "none"
        if (isNaN(confidence) || confidence < 60) {
            console.log('Low confidence or missing confidence data');
            classification = "none";
        }

        let userMessage;
        let category = "";

        // Handle classification cases
        if (classification === "truth") {
            userMessage = "The statement is classified as truth.";
        } else if (classification === "lie") {
            // Create a prompt to classify the type of lie
            const categoryPrompt = `Classify the following statement into one of these categories: "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;
            const categoryResponse = await generateResponse(categoryPrompt);
            category = categoryResponse.trim();

            // Fetch the message associated with the category from MongoDB
            const categoryData = await getContactInfoByCategory(category);

            if (categoryData && categoryData.length > 0) {
                const { URL, description } = categoryData[0];
                userMessage = `The statement is classified as a lie. If you need help or more information about this topic, you can visit the following resource: <a href="${URL}" target="_blank">${URL}</a>. ${description}`;
            } else {
                userMessage = `The statement is classified as a lie.`;
            }
        } else if (classification === "opinion") {
            // Classify the opinion into a relevant category, just like we do with lies
            const categoryPrompt = `Classify the following statement into one of these categories: "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;
            const categoryResponse = await generateResponse(categoryPrompt);
            category = categoryResponse.trim();

            // Fetch the message associated with the category from MongoDB
            const categoryData = await getContactInfoByCategory(category);

            if (categoryData && categoryData.length > 0) {
                const { URL, description } = categoryData[0];
                userMessage = `The statement is classified as an opinion. However, this opinion is potentially harmful. If you need help or more information about this topic, you can visit the following resource: <a href="${URL}" target="_blank">${URL}</a>. ${description}`;
            } else {
                userMessage = "The statement is classified as an opinion.";
            }
        } else if (classification === "none") {
            userMessage = "The statement could not be classified or confidence was too low.";
        } else {
            userMessage = "Unable to classify the statement. Please try again.";
        }

        // Send the response back to the client with the category in a separate field
        res.status(200).json({ classification, confidence, category, message: userMessage });
    } catch (error) {
        console.error("Detailed error message:", error);
        res.status(500).json({ message: "Error verifying or classifying content", error: error.message });
    }
};

export { verifyAndClassifyContent };
