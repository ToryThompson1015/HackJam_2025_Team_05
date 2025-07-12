import jwt from 'jsonwebtoken';
import User from '../../models/user/user-model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, cohort, graduationDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      cohort,
      graduationDate: new Date(graduationDate)
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cohort: user.cohort,
        currentLevel: user.currentLevel,
        experiencePoints: user.experiencePoints,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('currentTitle');

    if (user && (await user.comparePassword(password))) {
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cohort: user.cohort,
          currentLevel: user.currentLevel,
          experiencePoints: user.experiencePoints,
          totalPoints: user.totalPoints,
          currentTitle: user.currentTitle,
          avatar: user.avatar,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }) 
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('currentTitle')
      .populate('badges.achievement')
      .select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};