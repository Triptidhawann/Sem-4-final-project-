const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ isResolved: false }).sort({ createdAt: -1 });

        // Map the severity to match the frontend 'type' expectations
        const formattedAlerts = alerts.map(a => {
            const doc = a.toObject();
            doc.type = doc.severity.toLowerCase(); // frontend expects 'critical', 'high', 'medium', 'stable'
            if (doc.type === 'moderate') doc.type = 'medium';
            return doc;
        });

        res.status(200).json(formattedAlerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error: error.message });
    }
};

module.exports = { getAlerts };
