import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getCategoryInfo
} from '../../controllers/activities/activities-controller.js';
import { createActivityValidation, updateActivityValidation } from '../../middleware/validation/activity-validation.js';
import { handleValidationErrors } from '../../middleware/validation/validation-handler.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/categories', getCategoryInfo);
router.post('/', createActivityValidation, handleValidationErrors, createActivity);
router.get('/', getActivities);
router.get('/:id', getActivityById);
router.put('/:id', updateActivityValidation, handleValidationErrors, updateActivity);
router.delete('/:id', deleteActivity);

export default router;
