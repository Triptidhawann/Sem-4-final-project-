const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Tracking = require('../models/Tracking');

const getAlerts = async (req, res) => {
    try {
        const alerts = [];
        
        // 1. From Hospitals: oxygen < 60 -> Critical
        const hospitals = await Hospital.find({ oxygen: { $lt: 60 } });
        hospitals.forEach(h => {
            alerts.push({
                message: `${h.name} — Oxygen supply critically low (${h.oxygen}%). Immediate assistance required.`,
                type: 'critical',
                createdAt: h.updatedAt || h.createdAt
            });
        });

        // 2. From Requests: status = Approved -> Medium
        const requests = await Request.find({ status: 'Approved' });
        requests.forEach(r => {
            alerts.push({
                message: `${r.hospital} allocation request for ${r.quantity} ${r.resourceType} approved by admin.`,
                type: 'medium',
                createdAt: r.updatedAt
            });
        });

        // 3. From Tracking: status = In Transit -> High
        const tracking = await Tracking.find({ status: 'In Transit' });
        tracking.forEach(t => {
            alerts.push({
                message: `${t.quantity} units of ${t.resourceType} dispatched from ${t.fromHospital} to ${t.toHospital}.`,
                type: 'high',
                createdAt: t.updatedAt
            });
        });

        // Sort by createdAt descending
        alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error generating alerts', error: error.message });
    }
};

module.exports = { getAlerts };
