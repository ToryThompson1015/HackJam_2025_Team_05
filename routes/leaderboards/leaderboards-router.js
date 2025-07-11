import express from 'express';
import {
  getLeaderboards,
  getLeaderboardById,
  getTopPerformers,
  getCohortLeaderboard,
  updateLeaderboardRankings
} from '../../controllers/leaderboards/leaderboards-controller.js';
import authMiddleware from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getLeaderboards);
router.get('/top/:type/:timeframe', getTopPerformers);
router.get('/cohort/:cohort', getCohortLeaderboard);
router.get('/:id', getLeaderboardById);
router.post('/:id/update', updateLeaderboardRankings);

export default router;