import Title from '../../models/title/title-model.js';
import User from '../../models/user/user-model.js';

export const createTitle = async (req, res) => {
  try {
    const { name, description, levelRequired, category, color } = req.body;
    
    const title = new Title({
      name,
      description, 
      levelRequired,
      category,
      color,
      createdBy: req.user._id
    });
    
    await title.save();
    
    res.status(201).json({
      success: true,
      message: 'Title created successfully',
      data: title
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Title name already exists'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getTitles = async (req, res) => {
  try {
    const category = req.query.category;
    let filter = { isActive: true };
    if (category) filter.category = category;

    const titles = await Title.find(filter)
      .populate('holders.user', 'firstName lastName')
      .sort({ levelRequired: 1 });

    res.json({
      success: true,
      data: titles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getTitleById = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id)
      .populate('holders.user', 'firstName lastName avatar')
      .populate('prerequisites.achievements');

    if (!title) {
      return res.status(404).json({ 
        success: false, 
        message: 'Title not found' 
      });
    }

    res.json({
      success: true,
      data: title
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const claimTitle = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!title) {
      return res.status(404).json({ 
        success: false, 
        message: 'Title not found' 
      });
    }

    // Check if user already has this title
    const hasTitle = title.holders.some(
      holder => holder.user.toString() === user._id.toString()
    );

    if (hasTitle) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have this title' 
      });
    }

    // Check level requirement
    if (user.currentLevel < title.levelRequired) {
      return res.status(400).json({
        success: false,
        message: `Level ${title.levelRequired} required`
      });
    }

    // Award title
    title.holders.push({
      user: user._id,
      acquiredAt: new Date()
    });

    user.currentTitle = title._id;

    await Promise.all([title.save(), user.save()]);

    res.json({
      success: true,
      message: 'Title claimed successfully',
      data: {
        title: {
          _id: title._id,
          name: title.name,
          description: title.description,
          color: title.color
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