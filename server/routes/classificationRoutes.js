import express from 'express';
import { verifyAndClassifyContent } from '../controllers/promptBuilder.js';
import { findMostHarmfulSentence } from '../controllers/extensionPromptBuilder.js';

const router = express.Router();

// Route to verify and classify the content
router.post('/verify-classify', verifyAndClassifyContent);

// Route to find the most harmful sentence in the content
router.post('/find-harmful', findMostHarmfulSentence);

export default router;
