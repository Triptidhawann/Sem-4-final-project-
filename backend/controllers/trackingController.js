const Tracking = require('../models/Tracking');

// Fetch all tracking data
const getTracking = async (req, res) => {
    try {
        const trackingData = await Tracking.find().sort({ createdAt: -1 });
        res.status(200).json(trackingData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tracking data', error: error.message });
    }
};

// Update tracking status
const updateTrackingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedTracking = await Tracking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTracking) {
            return res.status(404).json({ message: 'Tracking entry not found' });
        }

        res.status(200).json(updatedTracking);
    } catch (error) {
        res.status(400).json({ message: 'Error updating tracking status', error: error.message });
    }
};

module.exports = {
    getTracking,
    updateTrackingStatus
};
