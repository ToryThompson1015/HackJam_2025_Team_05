import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../../controllers/auth/auth-controller.js';
import authMiddleware from '../../middleware/auth-middleware.js';
import { registerValidation, loginValidation } from '../../middleware/validation/auth-validation.js';
import { handleValidationErrors } from '../../middleware/validation/validation-handler.js';

const router = express.Router();

router.post('/register', registerValidation, handleValidationErrors, registerUser);
router.post('/login', loginValidation, handleValidationErrors, loginUser);
router.get('/profile', authMiddleware, getUserProfile);

export default router;