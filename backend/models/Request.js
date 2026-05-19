const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Declined"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        required: true
    },
    requestedBy: {
        type: String
    },
    userEmail: {
        type: String
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
