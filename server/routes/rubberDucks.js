import express from 'express';
import { verifyAndClassifyContent } from '../controllers/promptBuilder.js';
const router = express.Router();
// POST content to verify and classify
router.post('/verify-classify', verifyAndClassifyContent);
export default router;


