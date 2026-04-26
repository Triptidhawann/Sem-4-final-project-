const User = require('../models/User');
const Hospital = require('../models/Hospital');

// Fetch all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, status } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, role, status },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Automatically create a blank hospital inventory if approved
        if (updatedUser.role === 'hospital' && updatedUser.status === 'active') {
            const existingHospital = await Hospital.findOne({ name: updatedUser.name });
            if (!existingHospital) {
                const newHospital = new Hospital({
                    name: updatedUser.name,
                    city: updatedUser.city || 'Unknown',
                    beds: 0,
                    ventilators: 0,
                    oxygen: 0,
                    bloodUnits: 0,
                    status: 'Stable'
                });
                await newHospital.save();
            }
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser
};
