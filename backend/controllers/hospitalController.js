const Hospital = require('../models/Hospital');

// Fetch all hospitals
const getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
    }
};

// Create a new hospital
const createHospital = async (req, res) => {
    try {
        const hospitalData = { ...req.body };
        
        // Smart Status Logic
        if (hospitalData.oxygen !== undefined) {
            if (hospitalData.oxygen < 50) hospitalData.status = "Critical";
            else if (hospitalData.oxygen < 75) hospitalData.status = "Moderate";
            else hospitalData.status = "Stable";
        }

        const newHospital = new Hospital(hospitalData);
        const savedHospital = await newHospital.save();
        res.status(201).json(savedHospital);
    } catch (error) {
        res.status(400).json({ message: 'Error creating hospital', error: error.message });
    }
};

// Update a hospital
const updateHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // Smart Status Logic
        if (updateData.oxygen !== undefined) {
            if (updateData.oxygen < 50) updateData.status = "Critical";
            else if (updateData.oxygen < 75) updateData.status = "Moderate";
            else updateData.status = "Stable";
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(400).json({ message: 'Error updating hospital', error: error.message });
    }
};

// Delete a hospital
const deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHospital = await Hospital.findByIdAndDelete(id);

        if (!deletedHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting hospital', error: error.message });
    }
};

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
};
