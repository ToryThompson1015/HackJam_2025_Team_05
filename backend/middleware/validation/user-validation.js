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
    .withMessage('Avatar must be a string')
    //I have left out skillsContributed validation since we aren't using it right now, in the future we may so I will only comment out the code
//     skillsContributed: [{
//   skill: String,
//   level: {
//     type: String,
//     enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
//     default: 'Beginner'
//   }
// }],
];