import Leaderboard from '../../models/leaderboard/leaderboard-model.js';
import User from '../../models/user/user-model.js';
import Activity from '../../models/activity/activity-model.js';

export const getLeaderboards = async (req, res) => {
  try {
    const type = req.query.type;
    const timeframe = req.query.timeframe;

    let filter = { isActive: true };
    if (type) filter.type = type;
    if (timeframe) filter.timeframe = timeframe;

    const leaderboards = await Leaderboard.find(filter)
      .populate('participants.user', 'firstName lastName avatar currentTitle cohort graduationDate')
      .sort({ lastCalculated: -1 });

    res.json({
      success: true,
      data: leaderboards
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getLeaderboardById = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findById(req.params.id)
      .populate('participants.user', 'firstName lastName avatar currentLevel currentTitle cohort graduationDate');

    if (!leaderboard) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leaderboard not found' 
      });
    }

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getTopPerformers = async (req, res) => {
  try {
    const { type, timeframe } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Date filtering logic
    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case 'daily':
        dateFilter = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
        break;
      case 'weekly':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = { $gte: weekStart };
        break;
      case 'monthly':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { $gte: monthStart };
        break;
      case 'yearly':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        dateFilter = { $gte: yearStart };
        break;
      default:
        dateFilter = {}; // all-time
    }

    let results = [];

    switch (type) {
      case 'points':
        if (timeframe === 'all-time') {
          const users = await User.find({ isActive: true })
            .select('firstName lastName avatar totalPoints currentLevel currentTitle cohort graduationDate')
            .populate('currentTitle')
            .sort({ totalPoints: -1 })
            .limit(limit);
          
          results = users.map((user, index) => ({
            rank: index + 1,
            user,
            score: user.totalPoints
          }));
        } else {
          const pipeline = [
            { $match: { completedAt: dateFilter } },
            { $group: { _id: '$user', score: { $sum: '$pointsAwarded' } } },
            { $sort: { score: -1 } },
            { $limit: limit },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $project: {
                _id: 0,
                user: {
                  _id: '$user._id',
                  firstName: '$user.firstName',
                  lastName: '$user.lastName',
                  avatar: '$user.avatar',
                  currentLevel: '$user.currentLevel',
                  cohort: '$user.cohort',
                  graduationDate: '$user.graduationDate'
                },
                score: 1
              }
            }
          ];
          
          const aggregateResults = await Activity.aggregate(pipeline);
          results = aggregateResults.map((result, index) => ({
            rank: index + 1,
            ...result
          }));
        }
        break;

      case 'level':
        const usersByLevel = await User.find({ isActive: true })
          .select('firstName lastName avatar currentLevel experiencePoints cohort graduationDate')
          .sort({ currentLevel: -1, experiencePoints: -1 })
          .limit(limit);
        
        results = usersByLevel.map((user, index) => ({
          rank: index + 1,
          user,
          score: user.currentLevel
        }));
        break;
    }

    res.json({
      success: true,
      data: {
        type,
        timeframe,
        participants: results
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getCohortLeaderboard = async (req, res) => {
  try {
    const { cohort } = req.params;
    const type = req.query.type || 'points';
    const limit = parseInt(req.query.limit) || 20;

    let sortField = 'totalPoints';
    if (type === 'level') sortField = 'currentLevel';

    const cohortUsers = await User.find({ cohort, isActive: true })
      .select(`firstName lastName avatar cohort graduationDate ${sortField}`)
      .sort({ [sortField]: -1 })
      .limit(limit);

    const results = cohortUsers.map((user, index) => ({
      rank: index + 1,
      user,
      score: user[sortField]
    }));

    res.json({
      success: true,
      data: {
        type,
        cohort,
        participants: results
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateLeaderboardRankings = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findById(req.params.id);

    if (!leaderboard) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leaderboard not found' 
      });
    }

    // This would typically recalculate rankings
    leaderboard.lastCalculated = new Date();
    await leaderboard.save();

    res.json({
      success: true,
      message: 'Leaderboard updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
