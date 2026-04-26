const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    fromHospital: {
        type: String,
        required: true
    },
    toHospital: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Processing", "In Transit", "Delivered"],
        default: "Processing"
    }
}, { timestamps: true });

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;
