import express from 'express';
import { getUsers, getUserById, updateUserProfile, getUserStats } from '../../controllers/users/users-controller.js';
import { updateProfileValidation } from '../../middleware/validation/user-validation.js';
import { handleValidationErrors } from '../../middleware/validation/validation-handler.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfileValidation, handleValidationErrors, updateUserProfile);
router.get('/:id/stats', getUserStats);

export default router;