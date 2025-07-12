import express from 'express';
import { getTitles, getTitleById, claimTitle, createTitle } from '../../controllers/titles/titles-controller.js';
import authMiddleware from '../../middleware/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTitles);
router.post('/', createTitle);
router.get('/:id', getTitleById);
router.post('/:id/claim', claimTitle);

export default router;