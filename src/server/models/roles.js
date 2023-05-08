const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    name: {
        type: String
    },
    permissions: {
        type: Array
    }
});

const Entry = mongoose.model('roles', Schema);

module.exports = Entry;