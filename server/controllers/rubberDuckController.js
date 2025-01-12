import { generateResponse } from '../server/LLM/main.mjs';

// Verify content
// Adds a new function for checking if a statement is an opinion or a lie
const generateOpinionOrLiePrompt = (content) => {
    return `Is the following statement an opinion or a lie? ${content}`;
};

export { generateTypePrompt, generateFactVerificationPrompt, generateOpinionOrLiePrompt };

import { verifyContentWithLLM, getTypeWithLLM, checkOpinionOrLieWithLLM } from '../services/llmService';
import { generateTypePrompt, generateFactVerificationPrompt } from '../utils/promptBuilder';

const verifyAndClassifyContent = async (req, res) => {
    const { content } = req.body;
    const typePrompt = generateTypePrompt(content);

    try {
        const { type } = await getTypeWithLLM(typePrompt); // Determine if it's a fact or an opinion

        if (type === 'fact') {
            const verificationPrompt = generateFactVerificationPrompt(content);
            const { verdict, confidence } = await verifyContentWithLLM(verificationPrompt);

            if (verdict === 'false') {
                const opinionOrLiePrompt = generateOpinionOrLiePrompt(content);
                const { classification } = await checkOpinionOrLieWithLLM(opinionOrLiePrompt);
                const userMessage = `The statement is false. Further analysis suggests it is a(n) ${classification}.`;
                res.status(200).json({ type, verified: false, classification, message: userMessage });
            } else {
                const userMessage = `The statement is a fact and it is ${verdict}. Confidence: ${confidence}%.`;
                res.status(200).json({ type, verified: verdict, confidence, message: userMessage });
            }
        } else {
            const userMessage = "The statement is an opinion and not subject to factual verification.";
            res.status(200).json({ type, message: userMessage });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying or classifying content", error });
    }
};
export { verifyAndClassifyContent };

