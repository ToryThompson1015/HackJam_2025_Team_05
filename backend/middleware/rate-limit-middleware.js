// import rateLimit from 'express-rate-limit';

// // General rate limiter
// export const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: {
//     success: false,
//     message: 'Too many requests, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Auth rate limiter
// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5,
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });