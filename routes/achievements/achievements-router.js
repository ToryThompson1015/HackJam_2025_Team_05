import express from 'express';
import { getAchievements, getAchievementById, createAchievement } from '../../controllers/achievements/achievements-controller.js';
import authMiddleware from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', createAchievement);

export default router;
