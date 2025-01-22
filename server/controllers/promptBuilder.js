import { generateResponse } from '../../services/LLM/generativeAI.mjs';
import { getContactInfoByCategory } from '../../Database/database.js';

const verifyAndClassifyContent = async (req, res) => {
    const { content, age, gender } = req.body;

    try {
        // Step 1: Classify the statement as truth, lie, opinion, or none
        const classificationPrompt = `Classify the following statement as either "truth", "lie", "opinion", or "none". Only respond with one word: lie, truth, opinion, or none. Statement: ${content}`;
        const classificationResponse = await generateResponse(classificationPrompt);
        let classification = classificationResponse.trim().toLowerCase();

        // Step 2: Check confidence level in the classification
        const confidencePrompt = `On a scale of 0 - 100, how confident are you in classifying the following statement as ${classification}? Only respond with a number. Statement: ${content}`;
        const confidenceResponse = await generateResponse(confidencePrompt);
        const confidence = parseInt(confidenceResponse.trim(), 10);

        // Step 3: Handle low confidence scenario
        if (isNaN(confidence) || confidence < 60) {
            console.log('Low confidence or missing confidence data');
            classification = "none";
        }

        let userMessage;
        let category = "";

        // Step 4: Handle classification for "truth"
        if (classification === "truth") {
            userMessage = `<p>The statement is classified as <strong>truth</strong>.</p>`;
        } else if (classification === "lie" || classification === "opinion") {

            // Step 5: Classify the statement into categories based on age and gender
            let categoryPrompt = `Classify the following statement into one of these categories: "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;

            // Adjust category classification prompt based on age and gender
            if (age && gender) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's age (${age}) and gender (${gender}): ${categoryPrompt}`;
            } else if (age) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's age (${age}): ${categoryPrompt}`;
            } else if (gender) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's gender (${gender}): ${categoryPrompt}`;
            }

            const categoryResponse = await generateResponse(categoryPrompt);
            category = categoryResponse.trim();

            // Step 6: Get the category data for resources
            const categoryData = await getContactInfoByCategory(category);

            // Step 7: Create user message based on age and gender
            let ageGenderMessage = "";
            if (age && gender) {
                if (age < 18 && gender === "Female") {
                    ageGenderMessage = "This may affect young women.";
                } else if (age >= 18 && gender === "Female") {
                    ageGenderMessage = "This may affect older women.";
                } else if (age < 18 && gender === "Male") {
                    ageGenderMessage = "This may affect young men.";
                } else if (age >= 18 && gender === "Male") {
                    ageGenderMessage = "This may affect older men.";
                } else {
                    ageGenderMessage = "This may affect others.";
                }
            } else if (age) {
                ageGenderMessage = age < 18 ? "This may affect younger people." : "This may affect older people.";
            } else if (gender) {
                ageGenderMessage = gender === "Female" ? "This may affect women." : gender === "Male" ? "This may affect men." : "This may affect others.";
            }

            // Step 8: Provide resource information based on category
            const resourceInfo = categoryData && categoryData.length > 0
                ? `<p>If you need help or more information about this topic, you can visit the following:<br><strong>Resource:</strong><br><a href="${categoryData[0]?.URL}" target="_blank">${categoryData[0]?.URL}</a></p><p>${categoryData[0]?.description}</p>`
                : "<p>No specific resource found.</p>";

            // Final user message for classification
            userMessage = `
                <p>The statement is classified as a <strong>${classification}</strong>.</p>
                <p>${ageGenderMessage}</p>
                ${resourceInfo}
            `;

            // Step 9: Check if opinion is harmful and update message accordingly
            if (classification === "opinion") {
                const harmfulOpinionPrompt = `Is the following opinion harmful? Answer with "yes" or "no". Statement: ${content}`;
                const harmfulOpinionResponse = await generateResponse(harmfulOpinionPrompt);
                const isHarmfulOpinion = harmfulOpinionResponse.trim().toLowerCase();

                if (isHarmfulOpinion === "yes") {
                    userMessage = `
                        <p>The statement is classified as a <strong>harmful opinion</strong>.</p>
                        <p>${ageGenderMessage}</p>
                        ${resourceInfo}
                    `;
                }
            }
        } else if (classification === "none") {
            // Step 10: Handle case when classification fails
            userMessage = `<p>The statement could not be classified or confidence was too low.</p>`;
        } else {
            // Step 11: Handle any unclassified statements
            userMessage = `<p>Unable to classify the statement. Please try again.</p>`;
        }

        // Step 12: Return the classification result
        res.status(200).json({ classification, confidence, category, message: userMessage });
    } catch (error) {
        console.error("Detailed error message:", error);
        res.status(500).json({ message: "Error verifying or classifying content", error: error.message });
    }
};

export { verifyAndClassifyContent };