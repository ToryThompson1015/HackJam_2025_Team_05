import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  badge: {
    icon: {
      type: String,
      required: [true, 'Badge icon is required']
    },
    color: {
      type: String,
      required: [true, 'Badge color is required'],
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    }
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: [
      'mentoring',
      'learning',
      'community',
      'leadership',
      'consistency',
      'milestones',
      'special-events'
    ]
  },
  requirements: {
    type: {
      type: String,
      required: [true, 'Requirement type is required'],
      enum: [
        'activity-count',
        'points-total',
        'streak-days',
        'mentoring-hours',
        'level-reached',
        'skill-mastery',
        'special-condition'
      ]
    },
    target: {
      type: Number,
      required: [true, 'Requirement target is required'],
      min: 1
    },
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'all-time'],
      default: 'all-time'
    }
  },
  rarity: {
    type: String,
    required: [true, 'Achievement rarity is required'],
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
  },
  pointsBonus: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  earnedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ 'requirements.type': 1 });

export default mongoose.model('Achievement', achievementSchema);