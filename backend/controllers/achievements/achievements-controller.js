import Achievement from '../../models/achievement/achievement-model.js';

export const getAchievements = async (req, res) => {
  try {
    const category = req.query.category;
    const rarity = req.query.rarity;

    let filter = { isActive: true };
    if (category) filter.category = category;
    if (rarity) filter.rarity = rarity;

    const achievements = await Achievement.find(filter)
      .populate('earnedBy.user', 'firstName lastName')
      .sort({ rarity: 1, pointsBonus: -1 });

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('earnedBy.user', 'firstName lastName avatar');

    if (!achievement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Achievement not found' 
      });
    }

    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};