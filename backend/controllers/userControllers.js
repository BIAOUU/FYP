const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (user.suspended) {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
    }

    // Create a token
    const token = createToken(user._id);

    // Include the name from the profile in the response
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.profile.name,  // Correctly access the user's name
      categoryPreferences: user.categoryPreferences,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup a user
const signupUser = async (req, res) => {
  const { email, password, name, age, categoryPreferences } = req.body;
  const role = req.body.role || 'user';  // Default to 'user' if no role is provided

  try {
    const user = await User.signup(email, password, name, age, categoryPreferences, role);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a user's profile
const updateUserProfile = async (req, res) => {
  const { name, email, password, categoryPreferences } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.profile.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (categoryPreferences) {
      user.categoryPreferences = categoryPreferences;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...user.toObject(),
        name: user.profile.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all users, accessible only by admins
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user details by userId
const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const suspendUser = async (req, res) => {
  const { userId } = req.params;
  console.log('Received request to suspend user with ID:', userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.suspended = !user.suspended;
    await user.save();

    res.status(200).json({ message: 'User suspend status updated successfully', suspended: user.suspended });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserAgeDistribution = async (req, res) => {
  try {
    const users = await User.find({});
    const ageDistribution = {
      '21-30': 0,
      '31-40': 0,
      '<21': 0,
      '>40': 0,
    };

    users.forEach(user => {
      const age = user.profile.age;
      if (age < 21) ageDistribution['<21'] += 1;
      else if (age >= 21 && age <= 30) ageDistribution['21-30'] += 1;
      else if (age >= 31 && age <= 40) ageDistribution['31-40'] += 1;
      else ageDistribution['>40'] += 1;
    });

    res.json(ageDistribution);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch age distribution data' });
  }
};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: '"Top Care Fashion" <topcarefashion@gmail.com>', 
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent successfully!', verificationCode });
  } catch (error) {
    console.error("Error sending verification code:", error.message);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Export controllers
module.exports = {
  loginUser, signupUser, updateUserProfile, getAllUsers, getUserDetails,
  suspendUser, getUserAgeDistribution, sendVerificationCode, resetPassword
};
