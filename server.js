import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv'; config();// import dotenv from 'dotenv';

//Database Connection
import connectDB from './database/database.js'; connectDB() //Import Database //Connect to database


//Route Imports
import usersRouter from './routes/users/users-router.js';
import activitiesRouter from './routes/activities/activities-router.js';
import achievementsRouter from './routes/achievements/achievements-router.js';
import titlesRouter from './routes/titles/titles-router.js';
import leaderboardsRouter from './routes/leaderboards/leaderboards-router.js';
import authRouter from './routes/auth/auth-router.js';



const app = express() //initialize backend express app
const PORT = process.env.PORT || 5000

//Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimitMiddleware);

//Routes
app.use()
