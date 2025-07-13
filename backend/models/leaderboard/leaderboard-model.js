import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Leaderboard name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Leaderboard description is required']
  },
  type: {
    type: String,
    required: [true, 'Leaderboard type is required'],
    enum: ['points', 'level', 'activities', 'mentoring', 'achievements', 'custom']
  },
  timeframe: {
    type: String,
    required: [true, 'Timeframe is required'],
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'all-time']
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      required: true,
      default: 0
    },
    rank: {
      type: Number,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  prizes: [{
    rank: Number,
    reward: String,
    pointsBonus: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

// Indexes
leaderboardSchema.index({ type: 1, timeframe: 1 });
leaderboardSchema.index({ 'participants.rank': 1 });
leaderboardSchema.index({ 'participants.score': -1 });

export default mongoose.model('Leaderboard', leaderboardSchema);