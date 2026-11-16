const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const { generate } = require('../utils/shortId');
const Schema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
        default: () => generate()
    },
    filename: {
        type: String,
        required: true
    },
    storedFilename: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: ObjectId,
        ref: 'users',
        required: true
    },
    metadata: {
        type: Object
    },
    client: {
        type: String,
        default: 'web',
        enum: ['web', 'ShareX', 'other']
    }


}, { timestamps: true, versionKey: false});

const Entry = mongoose.model('media', Schema);

module.exports = Entry;