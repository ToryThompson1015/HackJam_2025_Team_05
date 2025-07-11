import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../../controllers/auth/auth-controller.js';
import { registerValidation, loginValidation } from '../../middleware/validation/auth-validation.js';
import { handleValidationErrors } from '../../middleware/validation/validation-handler.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, handleValidationErrors, registerUser);
router.post('/login', authLimiter, loginValidation, handleValidationErrors, loginUser);
router.get('/profile', authMiddleware, getUserProfile);

export default router;