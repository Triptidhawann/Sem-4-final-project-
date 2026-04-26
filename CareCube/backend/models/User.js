const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'hospital', 'ngo'],
        default: 'hospital'
    },
    city: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
