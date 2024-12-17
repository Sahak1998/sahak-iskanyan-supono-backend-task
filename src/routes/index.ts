import express from 'express';
import authRoutes from './auth';
import imgGenerationRoutes from './imgGeneration';
import { isAuthenticated } from '../middlewares';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/generate', isAuthenticated, imgGenerationRoutes);

export default router;
