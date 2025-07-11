import { body } from 'express-validator';

const VALID_CATEGORIES = [
  'mentoring', 'skill-development', 'community-contribution', 'networking',
  'career-advancement', 'learning', 'teaching', 'project-completion',
  'certification', 'volunteer-work'
];

const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

export const createActivityValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be 10-500 characters'),
  
  body('category')
    .isIn(VALID_CATEGORIES)
    .withMessage('Invalid category'),
  
  body('difficulty')
    .isIn(VALID_DIFFICULTIES)
    .withMessage('Invalid difficulty level')
];

export const updateActivityValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be 10-500 characters')
];