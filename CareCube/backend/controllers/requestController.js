const Request = require('../models/Request');
const Hospital = require('../models/Hospital');
const Tracking = require('../models/Tracking');
const Allocation = require('../models/Allocation');

// Fetch all requests
const getRequests = async (req, res) => {
    try {
        const { userEmail, hospital, requestedBy } = req.query;
        let query = {};
        if (userEmail) query.userEmail = { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') };
        if (hospital) query.hospital = { $regex: new RegExp(`^${hospital.trim()}$`, 'i') };
        if (requestedBy) query.requestedBy = { $regex: new RegExp(`^${requestedBy.trim()}$`, 'i') };
        
        const requests = await Request.find(query).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

// Create a new request
const createRequest = async (req, res) => {
    try {
        const newRequest = new Request(req.body);
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Error creating request', error: error.message });
    }
};

// Update request status
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true } // returns the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Sync Request Approval with Hospital Data
        if (status === 'Approved') {
            const hospital = await Hospital.findOne({ name: updatedRequest.hospital });
            if (hospital) {
                const rt = updatedRequest.resourceType.toLowerCase();
                const qty = Number(updatedRequest.quantity) || 0;
                
                // Deduct inventory since the hospital is providing it
                if (rt.includes('bed')) hospital.beds = Math.max(0, (hospital.beds || 0) - qty);
                else if (rt.includes('vent')) hospital.ventilators = Math.max(0, (hospital.ventilators || 0) - qty);
                else if (rt.includes('oxy')) hospital.oxygen = Math.max(0, (hospital.oxygen || 0) - qty);
                else if (rt.includes('blood')) hospital.bloodUnits = Math.max(0, (hospital.bloodUnits || 0) - qty);
                
                // Smart Status Logic Update for Oxygen
                if (rt.includes('oxy') && hospital.oxygen !== undefined) {
                    if (hospital.oxygen < 50) hospital.status = "Critical";
                    else if (hospital.oxygen < 75) hospital.status = "Moderate";
                    else hospital.status = "Stable";
                }

                await hospital.save();
            }

            // Create a Tracking Entry (legacy)
            const newTracking = new Tracking({
                resourceType: updatedRequest.resourceType,
                quantity: updatedRequest.quantity,
                fromHospital: updatedRequest.hospital,
                toHospital: updatedRequest.requestedBy || "Requester",
                status: "Processing",
                priority: updatedRequest.priority || "Medium",
                requestRef: updatedRequest._id
            });
            await newTracking.save();

            // Create an Allocation Entry (new system)
            const newAllocation = new Allocation({
                resourceType: updatedRequest.resourceType,
                quantity: updatedRequest.quantity,
                fromHospital: updatedRequest.hospital,
                toHospital: updatedRequest.requestedBy || "Requester",
                status: "Processing",
                priority: updatedRequest.priority || "Medium"
            });
            await newAllocation.save();
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Error updating request', error: error.message });
    }
};

// Update request details (Edit)
const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Error updating request', error: error.message });
    }
};

// Delete request
const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await Request.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting request', error: error.message });
    }
};

module.exports = {
    getRequests,
    createRequest,
    updateRequestStatus,
    updateRequest,
    deleteRequest
};
