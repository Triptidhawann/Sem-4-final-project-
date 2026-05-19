const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    beds: {
        type: Number
    },
    ventilators: {
        type: Number
    },
    oxygen: {
        type: Number
    },
    bloodUnits: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Critical", "Moderate", "Stable"],
        default: "Stable"
    }
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
