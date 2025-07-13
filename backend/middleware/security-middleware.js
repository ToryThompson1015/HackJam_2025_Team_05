// import cors from 'cors';
// import helmet from 'helmet';

// export const setupSecurity = (app) => {
//   // Security headers
//   app.use(helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https:"],
//       },
//     },
//   }));

//   // CORS configuration
//   app.use(cors({
//     origin: process.env.NODE_ENV === 'production' 
//       ? process.env.FRONTEND_URL?.split(',') || []
//       : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   }));
// };