const Allocation = require('../models/Allocation');
const Hospital = require('../models/Hospital');

// Fetch all allocations
const getAllocations = async (req, res) => {
    try {
        const allocations = await Allocation.find().sort({ createdAt: -1 });
        res.status(200).json(allocations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching allocations', error: error.message });
    }
};

// Create new allocation
const createAllocation = async (req, res) => {
    try {
        const { fromHospital, toHospital, resourceType, quantity, priority } = req.body;
        
        // 1. Create the allocation
        const newAllocation = new Allocation({
            fromHospital,
            toHospital,
            resourceType,
            quantity,
            priority,
            status: "Processing"
        });
        await newAllocation.save();

        // 2. Deduct from the source hospital
        const hospital = await Hospital.findOne({ name: fromHospital });
        if (hospital) {
            const rt = resourceType.toLowerCase();
            const qty = Number(quantity) || 0;
            
            if (rt.includes('bed')) hospital.beds = Math.max(0, (hospital.beds || 0) - qty);
            else if (rt.includes('vent')) hospital.ventilators = Math.max(0, (hospital.ventilators || 0) - qty);
            else if (rt.includes('oxy')) hospital.oxygen = Math.max(0, (hospital.oxygen || 0) - qty);
            else if (rt.includes('blood')) hospital.bloodUnits = Math.max(0, (hospital.bloodUnits || 0) - qty);
            
            // Smart Status Logic
            if (rt.includes('oxy') && hospital.oxygen !== undefined) {
                if (hospital.oxygen < 60 || hospital.beds < 10) hospital.status = "Critical";
                else if (hospital.oxygen < 80 || hospital.beds < 50) hospital.status = "Moderate";
                else hospital.status = "Stable";
            }

            await hospital.save();
        }

        res.status(201).json(newAllocation);
    } catch (error) {
        res.status(400).json({ message: 'Error creating allocation', error: error.message });
    }
};

// Update allocation status
const updateAllocationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedAllocation = await Allocation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAllocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        res.status(200).json(updatedAllocation);
    } catch (error) {
        res.status(400).json({ message: 'Error updating allocation', error: error.message });
    }
};

module.exports = {
    getAllocations,
    createAllocation,
    updateAllocationStatus
};
