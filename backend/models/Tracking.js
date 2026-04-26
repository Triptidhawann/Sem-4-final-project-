const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    fromHospital: {
        type: String,
        required: true,
        default: 'Central Reserve'
    },
    toHospital: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Processing", "In Transit", "Delivered"],
        default: "Processing"
    },
    priority: {
        type: String,
        default: "Medium"
    },
    requestRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);
