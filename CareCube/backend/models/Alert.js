const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Critical', 'High', 'Moderate', 'Stable'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    isResolved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
