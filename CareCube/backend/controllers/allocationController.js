const Allocation = require('../models/Allocation');

// Fetch allocations based on ID
const getAllocations = async (req, res) => {
    try {
        const { hospitalId } = req.query;
        let query = {};
        
        if (hospitalId) {
            query = {
                $or: [
                    { fromHospitalId: hospitalId },
                    { toHospitalId: hospitalId }
                ]
            };
        } else {
            // For admin or general queries, still exclude legacy data
            query.fromHospitalId = { $exists: true, $ne: null };
        }
        
        // Auto-purge old legacy data that doesn't fit the new schema
        await Allocation.deleteMany({ fromHospitalId: { $exists: false } });
        
        const allocations = await Allocation.find(query).sort({ createdAt: -1 });
        res.status(200).json(allocations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching allocations', error: error.message });
    }
};

// Update allocation status
const updateAllocationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { allocationStatus } = req.body;
        
        const updatedAllocation = await Allocation.findByIdAndUpdate(
            id,
            { allocationStatus },
            { new: true }
        );

        if (!updatedAllocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        // Sync corresponding Tracking record
        const Tracking = require('../models/Tracking');
        await Tracking.findOneAndUpdate(
            { allocationRef: id },
            { status: allocationStatus }
        );

        res.status(200).json(updatedAllocation);
    } catch (error) {
        res.status(400).json({ message: 'Error updating allocation', error: error.message });
    }
};

// Create a new allocation manually
const createAllocation = async (req, res) => {
    try {
        const { fromHospitalId, fromHospitalName, toHospitalId, toHospitalName, resource, quantity, priority, allocationStatus } = req.body;
        
        const newAllocation = new Allocation({
            fromHospitalId, fromHospitalName, toHospitalId, toHospitalName, resource, quantity, priority, allocationStatus
        });
        const savedAllocation = await newAllocation.save();

        // Automatically create a tracking entry
        const Tracking = require('../models/Tracking');
        const newTracking = new Tracking({
            fromHospitalId, fromHospitalName, toHospitalId, toHospitalName, resource, quantity, priority, 
            status: allocationStatus || 'Processing',
            allocationRef: savedAllocation._id
        });
        await newTracking.save();

        res.status(201).json(savedAllocation);
    } catch (error) {
        res.status(400).json({ message: 'Error creating allocation', error: error.message });
    }
};

module.exports = {
    getAllocations,
    updateAllocationStatus,
    createAllocation
};
