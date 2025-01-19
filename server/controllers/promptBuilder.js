import { generateResponse } from '../LLM/main.mjs';
import { getContactInfoByCategory } from '../../Database/database.js';

const verifyAndClassifyContent = async (req, res) => {
    const { content, age, gender } = req.body;

    try {
        // Step 1: Classify the statement as truth, lie, opinion, or none
        const classificationPrompt = `Classify the following statement as either "truth", "lie", "opinion", or "none". Only respond with one word: lie, truth, opinion, or none. Statement: ${content}`;
        const classificationResponse = await generateResponse(classificationPrompt);
        let classification = classificationResponse.trim().toLowerCase();

        // Step 2: Confidence check for classification
        const confidencePrompt = `On a scale of 0 - 100, how confident are you in classifying the following statement as ${classification}? Only respond with a number. Statement: ${content}`;
        const confidenceResponse = await generateResponse(confidencePrompt);
        const confidence = parseInt(confidenceResponse.trim(), 10);
        if (isNaN(confidence) || confidence < 60) {
            console.log('Low confidence or missing confidence data');
            classification = "none";
        }

        let userMessage;
        let category = "";

        // Step 3: Handle classification cases
        if (classification === "truth") {
            userMessage = "The statement is classified as truth.";
        } else if (classification === "lie" || classification === "opinion") {
            // Include age and gender in the category prompt
            let categoryPrompt = `Classify the following statement into one of these categories: "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;

            // Adjust category prompt based on age and gender
            if (age && gender) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's age (${age}) and gender (${gender}): "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;
            } else if (age) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's age (${age}): "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;
            } else if (gender) {
                categoryPrompt = `Classify the following statement into one of these categories, considering the user's gender (${gender}): "False Nutrition Claims", "Unverified Medical Claims", "Eating Disorders Encouragement", "Harmful Diet Practices", "Body Image Issues", "Fat Shaming and Discrimination", "Nutritional Supplements", "Gender Inequality or Challenges", "Emotional Abuse in Relationships", "Women and Girls in Crisis Situations", "Self-Harm Encouragement", "Emotional Distress", "Stress and Depression Triggers", "Unplanned Pregnancy", "Relationship Challenges", "Exploring Sexual Identity or Orientation", "Sexual Health and Education", "Offensive or Inciteful Content Online", "Cyberbullying and Online Harassment", "Misinformation or Fake News", "Emotional or Physical Abuse in Relationships", "Trauma or Recovery". Only respond with one category. Statement: ${content}`;
            }

            // Get the category from LLM
            const categoryResponse = await generateResponse(categoryPrompt);
            category = categoryResponse.trim();

            // Fetch the message associated with the category from MongoDB
            const categoryData = await getContactInfoByCategory(category);

            // Prepare age and gender-specific message
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
                } else if (age < 18) {
                    ageGenderMessage = "This may affect young people.";
                } else if (age >= 18) {
                    ageGenderMessage = "This may affect older people.";
                } else if (gender === "Female") {
                    ageGenderMessage = "This may affect women.";
                } else if (gender === "Male") {
                    ageGenderMessage = "This may affect men.";
                } else {
                    ageGenderMessage = "This may affect others.";
                }
            } else if (age) {
                ageGenderMessage = age < 18 ? "This may affect younger people." : "This may affect older people.";
            } else if (gender) {
                ageGenderMessage = gender === "Female" ? "This may affect women." : gender === "Male" ? "This may affect men." : "This may affect others.";
            }

            // Check if the opinion is harmful and adjust the message accordingly
            if (classification === "opinion") {
                const harmfulOpinionPrompt = `Is the following opinion harmful? Answer with "yes" or "no". Statement: ${content}`;
                const harmfulOpinionResponse = await generateResponse(harmfulOpinionPrompt);
                const isHarmfulOpinion = harmfulOpinionResponse.trim().toLowerCase();

                if (isHarmfulOpinion === "yes") {
                    userMessage = `The statement is classified as a harmful opinion. ${ageGenderMessage} If you need help or more information about this topic, you can visit the following resource: <a href="${categoryData[0]?.URL}" target="_blank">${categoryData[0]?.URL}</a>. ${categoryData[0]?.description}`;
                } else {
                    userMessage = `The statement is classified as an opinion. ${ageGenderMessage}`;
                }
            } else {
                if (categoryData && categoryData.length > 0) {
                    const { URL, description } = categoryData[0];
                    userMessage = `The statement is classified as a ${classification}. ${ageGenderMessage} If you need help or more information about this topic, you can visit the following resource: <a href="${URL}" target="_blank">${URL}</a>. ${description}`;
                } else {
                    userMessage = `The statement is classified as a ${classification}. ${ageGenderMessage} No specific resource found.`;
                }
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
