const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    type: {
        type: String
    },
    path: {
        type: String
    },
    name: {
        type: String
    },
    date: {
        type: Date
    },
    user: {
        type: ObjectId,
        ref: 'users'
    },
    size: {
        type: Number
    }
    
});

const Entry = mongoose.model('posts', Schema);

module.exports = Entry;