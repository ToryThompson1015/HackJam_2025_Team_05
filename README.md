# Per Scholas Alumni Gamified Platform

A full-stack MERN application designed to engage Per Scholas alumni through gamification, encouraging continued learning, mentoring, and community contribution.

## Overview

This platform allows Per Scholas graduates to:
- **Track Activities**: Log learning activities, mentoring sessions, community contributions, and career milestones
- **Earn Points & Level Up**: Gain experience points and advance through levels based on achievements
- **Get AI Suggestions**: Receive personalized activity recommendations powered by OpenAI
- **Connect with Alumni**: Browse fellow graduates and their accomplishments
- **Compete on Leaderboards**: See rankings and celebrate achievements
- **Build Profiles**: Showcase skills, badges, and progression

## Features

### Gamification System
- **Experience Points (XP)**: Earn points for completing activities
- **Leveling System**: Progress through levels based on XP accumulation
- **Badges & Achievements**: Unlock special recognitions for milestones
- **Titles**: Earn prestigious titles based on contributions
- **Leaderboards**: Compete with fellow alumni across different metrics

### AI-Powered Recommendations
- **Personalized Suggestions**: Get tailored activity recommendations based on your progress
- **Progress Insights**: AI analysis of your strengths and growth opportunities
- **Next Goal Planning**: Smart suggestions for advancing to the next level

### User Management Features
- **User Registration/Authentication**: Email/password login with bcrypt hashing
- **User Profiles**: First name, last name, avatar, email
- **Cohort Tracking**: Tracks which Per Scholas program and timeframe users graduated from
- **Graduation Date Tracking**: Records when users completed their Per Scholas program

### Activity Tracking
- **Multiple Categories**: Mentoring, skill development, community contribution, networking, and more
- **Difficulty Levels**: Easy, Medium, Hard, Expert activities with varying point values
- **Evidence Documentation**: Upload proof of completion for verification
- **Tagging System**: Organize activities with relevant tags

### Community Features
- **Alumni Directory**: Browse and connect with fellow graduates
- **Skills Showcase**: Display your expertise and contributions
- **Mentoring Stats**: Track your impact as a mentor
- **Cohort Connections**: Connect with your graduation cohort

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for security
- **Express Rate Limit** for API protection
- **Express Validator** for input validation

### Frontend
- **React** with React Router
- **Context API** for state management
- **Lucide React** for icons
- **OpenAI API** integration for AI suggestions
- **Responsive CSS** design

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (for AI suggestions)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd perscholas-leaderboard-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/perscholas-leaderboard
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend root:
   ```env
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get paginated users list
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Activities
- `GET /api/activities` - Get activities (with filters)
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Leaderboards
- `GET /api/leaderboards` - Get leaderboard data

### AI Suggestions
- `POST /api/ai/suggestions` - Get AI-powered activity suggestions

## Usage Guide

### Getting Started
1. **Register** with your Per Scholas cohort information
2. **Complete your profile** with graduation date and skills
3. **Create your first activity** to start earning points
4. **Explore AI suggestions** for personalized recommendations

### Activity Categories & Points
- **Mentoring** (50 pts): Guide fellow alumni or current students
- **Teaching** (60 pts): Conduct workshops or training sessions
- **Certification** (75 pts): Earn industry certifications
- **Community Contribution** (40 pts): Volunteer or give back
- **Skill Development** (30 pts): Learn new technologies or skills
- **Career Advancement** (35 pts): Job promotions or career moves
- **Project Completion** (45 pts): Finish personal or professional projects
- **Volunteer Work** (30 pts): Community service activities
- **Learning** (25 pts): Continuous education efforts
- **Networking** (20 pts): Professional relationship building

### Leveling System
- **Level Calculation**: `Math.floor(√(experiencePoints / 100)) + 1`
- **Next Level Requirement**: `(nextLevel - 1)² × 100` experience points
- **Benefits**: Higher levels unlock new titles and recognition

### AI Suggestions Feature
The AI system analyzes your:
- Current level and experience points
- Recent activity patterns
- Cohort information
- Mentoring statistics
- Badge achievements

It provides:
- **Personalized Activity Suggestions**: Tailored to your profile and goals
- **Progress Insights**: Analysis of strengths and opportunities
- **Next Level Planning**: Strategic recommendations for advancement
- **Motivational Messages**: Encouraging feedback on your journey

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Rate Limiting**: API request limiting to prevent abuse
- **Input Validation**: Comprehensive validation using Express Validator
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet.js**: Security headers for protection against common vulnerabilities

## Project Structure

```
backend/
├── middleware/
│   └── validation/
├── models/
│   ├── user/
│   └── activity/
├── routes/
│   ├── auth/
│   ├── users/
│   ├── activities/
│   ├── achievements/
│   ├── titles/
│   ├── leaderboards/
│   └── ai/
├── database/
│   └── database.js
└── server.js

frontend/
├── components/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Activities/
│   ├── Users/
│   ├── Leaderboards/
│   ├── Profile/
│   ├── AI/
│   └── Layout/
├── contexts/
│   └── AuthContext.js
├── services/
│   └── api.js
└── App.js
```

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start React development server
- `npm run build` - Build production bundle
- `npm test` - Run React tests

### Code Quality
- **Validation**: Input validation on all endpoints
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Request logging with Morgan
- **Security**: Multiple layers of security protection

## Future Enhancements

- **Real-time Notifications**: WebSocket integration for instant updates
- **Advanced Analytics**: Detailed progress tracking and insights
- **Mentor Matching**: AI-powered mentor-mentee pairing
- **Skills Assessments**: Integrated skill evaluation tools
- **Mobile App**: React Native mobile application
- **Integration APIs**: Connect with LinkedIn, GitHub, and other platforms

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/feature`)
5. Open a Pull Request
