import { body } from 'express-validator';

const VALID_COHORTS = [
  'Web Dev 2024-Winter', 'Web Dev 2023-Fall', 'Web Dev 2023-Summer', 'Web Dev 2023-Spring',
  'Data Analytics 2024-Winter', 'Data Analytics 2023-Fall', 'Data Analytics 2023-Summer', 'Data Analytics 2023-Spring',
  'Cybersecurity 2024-Winter', 'Cybersecurity 2023-Fall', 'Cybersecurity 2023-Summer',
  'Cloud Computing 2024-Winter', 'Cloud Computing 2023-Fall',
  'Software Engineering 2024-Winter', 'Software Engineering 2023-Fall'
];

export const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('cohort')
    .isIn(VALID_COHORTS)
    .withMessage('Please select a valid cohort'),
  
  body('graduationDate')
    .isISO8601()
    .withMessage('Please provide a valid graduation date')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];