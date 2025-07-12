import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  cohort: {
    type: String,
    required: [true, 'Cohort is required'],
    trim: true,
    enum: [
    'Web Dev 2024-Winter', 'Web Dev 2023-Fall', 'Web Dev 2023-Summer', 'Web Dev 2023-Spring',
    'Data Analytics 2024-Winter', 'Data Analytics 2023-Fall', 'Data Analytics 2023-Summer', 'Data Analytics 2023-Spring',
    'Cybersecurity 2024-Winter', 'Cybersecurity 2023-Fall', 'Cybersecurity 2023-Summer',
    'Cloud Computing 2024-Winter', 'Cloud Computing 2023-Fall',
    'Software Engineering 2024-Winter', 'Software Engineering 2023-Fall'
  ]
},
  graduationDate: {
    type: Date,
    required: [true, 'Graduation date is required']
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  experiencePoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  currentTitle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title',
    default: null
  },
  badges: [{
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  mentoringStats: {
    menteesCount: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    hoursLogged: { type: Number, default: 0 }
  },
  skillsContributed: [{
    skill: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ totalPoints: -1 });
userSchema.index({ currentLevel: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on experience points
userSchema.methods.calculateLevel = function() {
  // Level formula: Level = floor(sqrt(XP / 100)) + 1
  this.currentLevel = Math.floor(Math.sqrt(this.experiencePoints / 100)) + 1;
  return this.currentLevel;
};

// Get next level requirements
userSchema.methods.getNextLevelRequirement = function() {
  const nextLevel = this.currentLevel + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
};

export default mongoose.model('User', userSchema);