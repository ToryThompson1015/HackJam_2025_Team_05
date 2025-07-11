import { body } from 'express-validator';

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];