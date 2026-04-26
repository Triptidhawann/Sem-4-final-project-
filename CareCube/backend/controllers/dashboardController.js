const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Tracking = require('../models/Tracking');

const getDashboardStats = async (req, res) => {
    try {
        const totalHospitals = await Hospital.countDocuments();
        const criticalRequests = await Request.countDocuments({ priority: { $regex: /critical/i } });
        const inTransit = await Tracking.countDocuments({ status: 'In Transit' });
        
        // Let's just use all delivered allocations to simulate "Allocations Made"
        const deliveredToday = await Tracking.countDocuments({ status: 'Delivered' });

        const hospitalStats = await Hospital.aggregate([
            {
                $group: {
                    _id: null,
                    avgBeds: { $avg: "$beds" },
                    avgVents: { $avg: "$ventilators" },
                    avgOx: { $avg: "$oxygen" },
                    avgBlood: { $avg: "$bloodUnits" }
                }
            }
        ]);

        const averages = hospitalStats[0] || { avgBeds: 0, avgVents: 0, avgOx: 0, avgBlood: 0 };

        // Fetch hospital list for the table
        const hospitals = await Hospital.find().sort({ createdAt: -1 });

        res.status(200).json({
            totalHospitals,
            criticalRequests,
            inTransit,
            deliveredToday,
            averages,
            hospitals
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
};

module.exports = { getDashboardStats };
