import Activity from '../../models/activity/activity-model.js';
import User from '../../models/user/user-model.js';

export const createActivity = async (req, res) => {
  try {
    const { title, description, category, difficulty, evidence, tags } = req.body;

    const activity = await Activity.create({
      title,
      description,
      category,
      difficulty,
      evidence,
      tags,
      user: req.user._id
    });

    // Update user points
    const user = await User.findById(req.user._id);
    user.experiencePoints += activity.pointsAwarded;
    user.totalPoints += activity.pointsAwarded;
    user.calculateLevel();
    await user.save();

    const populatedActivity = await Activity.findById(activity._id).populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: populatedActivity
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const userId = req.query.userId;

    let filter = {};
    if (category) filter.category = category;
    if (userId) filter.user = userId;

    const activities = await Activity.find(filter)
      .populate('user', 'firstName lastName avatar')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: {
        activities,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalActivities: total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('user', 'firstName lastName avatar')
      .populate('verifiedBy', 'firstName lastName');

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    res.json({
      success: true,
      data: updatedActivity
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found' 
      });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Update user points (subtract)
    const user = await User.findById(req.user._id);
    user.experiencePoints = Math.max(0, user.experiencePoints - activity.pointsAwarded);
    user.totalPoints = Math.max(0, user.totalPoints - activity.pointsAwarded);
    user.calculateLevel();
    await user.save();

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getCategoryInfo = async (req, res) => {
  try {
    const categories = Activity.getCategoryList();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};