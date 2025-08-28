const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc   Register a new user
// @route  POST /api/users/register
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'user' // Defaults to 'user' if no role is provided
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, username: savedUser.username, role: savedUser.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc   Login a user
// @route  POST /api/users/login
exports.login = async (req, res) => {
  console.log('\n--- New Login Attempt ---');
  try {
    const { username, password } = req.body;
    console.log(`1. Attempting login for username: '${username}'`);

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log('2. User not found in database. Sending 401.');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('2. User found in database:', user.username);

    // Check if password is correct
    console.log('3. Comparing provided password with stored hash...');
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('4. Password does NOT match. Sending 401.');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('4. Password MATCHES.');

    // Create JWT Token
    console.log('5. Creating JWT token...');
    const payload = { id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('6. Login successful. Sending token.');
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });

  } catch (error) {
    console.error('!!! SERVER ERROR DURING LOGIN ATTEMPT !!!', error);
    res.status(500).json({ message: 'Server error', error });
  }
};