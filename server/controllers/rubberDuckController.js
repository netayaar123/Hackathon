//import { verifyContentWithLLM } from '../services/llmService';  // Daniela needs to add the llmService

// Verify content
// Adds a new function for checking if a statement is an opinion or a lie
const generateOpinionOrLiePrompt = (content) => {
    return `Is the following statement an opinion or a lie? ${content}`;
};

export { generateTypePrompt, generateFactVerificationPrompt, generateOpinionOrLiePrompt };

import { verifyContentWithLLM, getTypeWithLLM, checkOpinionOrLieWithLLM } from '../services/llmService';
import { generateTypePrompt, generateFactVerificationPrompt, generateOpinionOrLiePrompt } from '../utils/promptBuilder';

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

// import ducks from '../data/duckData.js';

// // Get all ducks
// const getAllDucks = (req, res) => {
//     res.status(200).json({ ducks });
// };

// // Get a random duck
// const getRandomDuck = (req, res) => {
//     const randomIndex = Math.floor(Math.random() * ducks.length);
//     res.status(200).json(ducks[randomIndex]);
// };

// // Get a single duck
// const getSingleDuck = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const duck = ducks.find(d => d.id === id);

//     if (!duck) {
//         return res.status(404).json({ mssg: "Duck not found" });
//     }
//     res.status(200).json({ duck });
// };

// // Create a new duck
// const createDuck = (req, res) => {
//     const { name, color, imageUrl } = req.body;
//     const newDuck = {
//         id: ducks.length ? ducks[ducks.length - 1].id + 1 : 1,
//         name,
//         color,
//         imageUrl
//     };
//     ducks.push(newDuck);
//     res.status(201).json({ duck: newDuck });
// };

// // Delete a duck
// const deleteDuck = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const duckIndex = ducks.findIndex(d => d.id === id);

//     if (duckIndex === -1) {
//         return res.status(404).json({ mssg: "Duck not found" });
//     }

//     const [deletedDuck] = ducks.splice(duckIndex, 1);
//     res.status(200).json({ duck: deletedDuck });
// };

// // Update a duck
// const updateDuck = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const duckIndex = ducks.findIndex(d => d.id === id);

//     if (duckIndex === -1) {
//         return res.status(404).json({ mssg: "Duck not found" });
//     }

//     const updatedDuck = { ...ducks[duckIndex], ...req.body };
//     ducks[duckIndex] = updatedDuck;
//     res.status(200).json({ duck: updatedDuck });
// };

// export {
//     getAllDucks,
//     getRandomDuck,
//     getSingleDuck,
//     createDuck,
//     deleteDuck,
//     updateDuck
// };
