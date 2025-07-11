import express from 'express';
import { getTitles, getTitleById, claimTitle } from '../../controllers/titles/titles-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTitles);
router.get('/:id', getTitleById);
router.post('/:id/claim', claimTitle);

export default router;