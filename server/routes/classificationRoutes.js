import express from 'express';
import { verifyAndClassifyContent } from '../controllers/promptBuilder.js';
import { findMostHarmfulSentence } from '../controllers/extensionPromptBuilder.js';
const router = express.Router();
router.post('/verify-classify', verifyAndClassifyContent);
router.post('/find-harmful', findMostHarmfulSentence);
export default router;

