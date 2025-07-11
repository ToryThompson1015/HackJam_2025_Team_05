import express from 'express';
import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import { config } from 'dotenv'; config();// import dotenv from 'dotenv';

//Database Connection
import connectDB from './database/database.js'; connectDB() //Import Database //Connect to database

/////////////////////////
///// Route Imports /////
/////////////////////////

import usersRouter from './routes/users/users-router.js';
import activitiesRouter from './routes/activities/activities-router.js';
import achievementsRouter from './routes/achievements/achievements-router.js';
import titlesRouter from './routes/titles/titles-router.js';
import leaderboardsRouter from './routes/leaderboards/leaderboards-router.js';
import authRouter from './routes/auth/auth-router.js';

//////////////////////////////
///// Middleware Imports /////
//////////////////////////////

// import { generalLimiter } from './middleware/rate-limit-middleware.js';
// import { setupErrorHandling } from './middleware/error-middleware.js';
// import { setupSecurity } from './middleware/security-middleware.js';

//Security Middleware
// setupSecurity(app);


const app = express() //initialize backend express app
const PORT = process.env.PORT || 5000

//////////////////////
///// Middleware /////
//////////////////////

// app.use(helmet());
app.use(cors());

//Request logging
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

//Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
// app.use(generalLimiter);

///////////////////////////////
///// Development Logging /////
///////////////////////////////

//log every incoming request's method and path, but only when in development mode.
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(` ${req.method} ${req.path}`);
        next();
    });
}

//Health Check to make sure API is running smooth
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Per Scholas Alumni Platform API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});


//////////////////////
///// API Routes /////
//////////////////////

app.use('/api/users', usersRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/titles', titlesRouter);
app.use('/api/leaderboards', leaderboardsRouter);
app.use('/api/auth',  authRouter);

//////////////////////////
///// Erroe Handling /////
//////////////////////////

// setupErrorHandling(app);

//Start Server
app.listen(PORT, (req, res) => {
    console.log(`Server is listening on PORT: ${PORT}`);
});
