const mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = new mongoose.Schema({
    signup_enabled: {
        type: Boolean
    },
    upload_enabled: {
        type: Boolean
    },
    api_enabled: {
        type: Boolean
    },
    site_theme: {
        type: String
    }

    
});

const Entry = mongoose.model('settings', Schema);

module.exports = Entry;