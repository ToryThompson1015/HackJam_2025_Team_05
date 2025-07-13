import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Competition title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Competition description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  rules: [{
    type: String,
    required: true
  }],
  prizes: [{
    place: {
      type: Number,
      required: true,
      min: 1
    },
    reward: {
      type: String,
      required: true
    },
    pointsBonus: {
      type: Number,
      default: 0
    }
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  category: {
    type: String,
    required: [true, 'Competition category is required'],
    enum: ['individual', 'team', 'cohort-based', 'skill-based']
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
competitionSchema.index({ status: 1, startDate: 1 });
competitionSchema.index({ category: 1 });

export default mongoose.model('Competition', competitionSchema);