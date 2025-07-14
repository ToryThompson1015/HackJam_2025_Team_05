import User from '../../models/user/user-model.js';
import Activity from '../../models/activity/activity-model.js';
import Title from '../../models/title/title-model.js';

const assignFirstChampionTitle = async () => {
  try {
    const firstChampionTitle = await Title.findOne({ name: 'First Champion' });
    
    if (!firstChampionTitle) {
      console.warn('First Champion title not found');
      return;
    }

    const topUser = await User.findOne({ isActive: true })
      .sort({ totalPoints: -1, currentLevel: -1 })
      .limit(1);

    if (!topUser) {
      return;
    }

    await User.updateMany(
      { currentTitle: firstChampionTitle._id },
      { $unset: { currentTitle: 1 } }
    );

    await User.findByIdAndUpdate(topUser._id, {
      currentTitle: firstChampionTitle._id
    });

    console.log(`First Champion title assigned to ${topUser.firstName} ${topUser.lastName}`);
  } catch (error) {
    console.error('Error assigning First Champion title:', error);
  }
};

export const getUsers = async (req, res) => {
  try {
    await assignFirstChampionTitle();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .populate('currentTitle')
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        users,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('currentTitle')
      .populate('badges.achievement');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const recentActivities = await Activity.find({ user: user._id })
      .sort({ completedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar, skillsContributed } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.avatar = avatar || user.avatar;
      user.skillsContributed = skillsContributed || user.skillsContributed;

      const updatedUser = await user.save();

      await assignFirstChampionTitle();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          skillsContributed: updatedUser.skillsContributed
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const totalActivities = await Activity.countDocuments({ user: userId });
    const activitiesByCategory = await Activity.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const monthlyPoints = await Activity.aggregate([
      {
        $match: {
          user: user._id,
          completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
    ]);

    res.json({
      success: true,
      data: {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          currentLevel: user.currentLevel,
          experiencePoints: user.experiencePoints,
          totalPoints: user.totalPoints,
          currentTitle: user.currentTitle
        },
        stats: {
          totalActivities,
          activitiesByCategory,
          monthlyPoints: monthlyPoints[0]?.total || 0,
          badgeCount: user.badges.length,
          mentoringStats: user.mentoringStats
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
