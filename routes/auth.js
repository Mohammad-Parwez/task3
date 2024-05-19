const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ensure the JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}

// User Registration
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        user = new User({ email, username, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Save token in cookies
        res.cookie('token', token, { httpOnly: true });

        // Send the token and user data in the response
        return res.status(201).json({ token, user, message: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Save token in cookies
        res.cookie('token', token, { httpOnly: true });

        // Send the token and user data in the response
        return res.status(200).json({
            message: 'Successfully Logged In',
            token,
            user
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Forget Password API (placeholder)
router.post('/forgotpassword', (req, res) => {
    // Logic for forgot password (send reset link via email, etc.)
    return res.json({ message: 'Forgot password functionality to be implemented' });
});

// User Logout
router.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        return res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred during logout' });
    }
});

module.exports = router;
