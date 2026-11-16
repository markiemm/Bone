const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, versionKey: 'versionKey' });

const Entry = mongoose.model('apiKeys', Schema);

module.exports = Entry;