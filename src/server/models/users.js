const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    
    quota: {
        type: Number
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    api_key: {
        type: String
    }




});

const Entry = mongoose.model('users', Schema);

module.exports = Entry;