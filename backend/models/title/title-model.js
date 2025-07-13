import mongoose from 'mongoose';

const titleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Title name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Title name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Title description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  levelRequired: {
    type: Number,
    required: [true, 'Level requirement is required'],
    min: 1
  },
  category: {
    type: String,
    required: [true, 'Title category is required'],
    enum: [
      'newcomer',
      'mentor',
      'expert',
      'leader',
      'contributor',
      'achiever',
      'master'
    ]
  },
  color: {
    type: String,
    required: [true, 'Title color is required'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  prerequisites: {
    achievements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }],
    activities: {
      minimumCount: { type: Number, default: 0 },
      categories: [String]
    },
    mentoringHours: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  holders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acquiredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
titleSchema.index({ levelRequired: 1 });
titleSchema.index({ category: 1 });

export default mongoose.model('Title', titleSchema);