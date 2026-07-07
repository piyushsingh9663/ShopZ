const User = require('../model/user');
const Order = require('../model/order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail  = require('../utils/sendMail');


const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });  
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user with OTP and unverified status
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
    });

    if (user) {
        const message = `Hi ${user.name},\n\nThanks for registering in shopZ.\nYour OTP for email verification is: ${otp}.`;

        await sendEmail({
          email: user.email,
          subject: 'Email Verification',
          message
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });
    }
    else { 
        res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified. Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  }
  catch (error) {
    res.status(500).json({ message: 'Server error' });
  } 
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has any pending or shipped orders
    const pendingOrders = await Order.findOne({
      user: userId,
      status: { $in: ['pending', 'shipped'] }
    });

    if (pendingOrders) {
      return res.status(400).json({ 
        message: 'Cannot delete account. Please cancel or wait for all orders to be delivered before deleting your account.' 
      });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, getUsers, deleteAccount };