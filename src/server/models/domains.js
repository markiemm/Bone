const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    domain: {
        type: String
    },
    active: {
        type: Boolean
    },
    isDefault: {
        type: Boolean
    },
    HTTPS: {
        type: Boolean
    },
});

const Entry = mongoose.model('domains', Schema);

module.exports = Entry;