const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'carecube_secret_key', {
        expiresIn: '30d',
    });
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, city } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine initial status based on role
        const initialStatus = role === 'hospital' ? 'pending' : 'active';

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'hospital',
            city: role === 'hospital' ? city : '',
            status: initialStatus
        });
        await newUser.save();

        res.status(201).json({ 
            message: 'Registration successful',
            token: generateToken(newUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // Fallback for old plaintext passwords during development
        const isLegacyMatch = user.password === password;

        if (!isMatch && !isLegacyMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Restrict admin access
        if (role === 'admin' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Only predefined admins can log in to the admin panel.' });
        }

        // Check Hospital Approval Status
        if (user.role === 'hospital' && user.status !== 'active') {
            return res.status(403).json({ message: 'Your account is pending admin approval' });
        }

        // If legacy password matched, hash it for future
        if (isLegacyMatch && !isMatch) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            city: user.city,
            organization: user.organization,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, organization, phone } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.organization = organization !== undefined ? organization : user.organization;
        user.phone = phone !== undefined ? phone : user.phone;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            organization: updatedUser.organization,
            phone: updatedUser.phone
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update password
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== currentPassword) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updatePassword
};
