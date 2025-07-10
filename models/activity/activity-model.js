import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Activity category is required'],
    enum: [
      'mentoring',
      'skill-development',
      'community-contribution',
      'networking',
      'career-advancement',
      'learning',
      'teaching',
      'project-completion',
      'certification',
      'volunteer-work'
    ]
  },
  pointsAwarded: {
    type: Number,
    // Removed required: true since it's auto-assigned
    min: [1, 'Points must be at least 1'],
    default: 25 // Fallback default
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard', 'Expert']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'verified'],
    default: 'completed'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  evidence: {
    type: String,
    default: ''
  },
  tags: [String],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: null
  }
}, {
  timestamps: true
});

// Points configuration - centralized in the model
const CATEGORY_POINTS = {
  'mentoring': 50,              // Core Per Scholas value
  'teaching': 60,               // Sharing expertise with others  
  'certification': 75,          // Professional skill advancement
  'community-contribution': 40, // Giving back to Per Scholas
  'skill-development': 30,      // Personal technical growth
  'career-advancement': 35,     // Professional development
  'project-completion': 45,     // Demonstrating practical skills
  'volunteer-work': 30,         // Community service
  'learning': 25,               // Educational activities
  'networking': 20              // Professional connections
};

// Pre-save middleware to auto-assign points based on category when creating activities
activitySchema.pre('save', function(next) {
  if (this.isNew) { // Only for new activities
    this.pointsAwarded = CATEGORY_POINTS[this.category] || 25;
  }
  next();
});

// Static method to get points for a category (useful for frontend display)
activitySchema.statics.getPointsForCategory = function(category) {
  return CATEGORY_POINTS[category] || 25;
};

// Static method to get all categories with their points (useful for dropdowns)
activitySchema.statics.getCategoryList = function() {
  return Object.keys(CATEGORY_POINTS).map(category => ({
    value: category,
    label: category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    points: CATEGORY_POINTS[category]
  }));
};

// Instance method to check if activity is high-value (might need verification)
activitySchema.methods.isHighValue = function() {
  return this.pointsAwarded >= 50; // Mentoring, Teaching, Certification
};

// Indexes for better performance i.e. make database queries super fast because don't have to go through entire data in database, it jumps to it.
activitySchema.index({ user: 1, completedAt: -1 });
activitySchema.index({ category: 1 });
activitySchema.index({ pointsAwarded: -1 });

export default mongoose.model('Activity', activitySchema);