const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const { generate } = require('../utils/shortId');
const Schema = new mongoose.Schema({
    notificationId: {
        type: String,
        default: () => generate(10),
        unique: true
    },
    user: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['upload', 'account', 'system', 'security'],
        required: true
    },
    important: {
        type: Boolean,
        default: false
    },
}, { timestamps: true, versionKey: false});

const Entry = mongoose.model('notifications', Schema);

module.exports = Entry;