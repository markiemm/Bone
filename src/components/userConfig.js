const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const apiModel = require('../models/apiKeys');
const { generateApiKey } = require('../utils/keyGenerator');
const { check } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    changeUserPassword: async (userId, oldPassword, newPassword) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return true;
    },

    createApiKey: async (userId) => {

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const apiKey = generateApiKey(user._id, user.username, user.email);
        const salt = await bcrypt.genSalt(10);
        const hashedKey = await bcrypt.hash(apiKey, salt);

        const newApiKey = new apiModel({
            owner: user._id,
            apiKey: hashedKey,
            createdAt: Date.now()
        });

        await newApiKey.save();
        return apiKey;
    },

    regenerateApiKey: async (userId) => {
        await apiModel.deleteMany({ owner: userId });
        return await module.exports.createApiKey(userId);
    },

    userApiKey: async (userId) => {
        const apiKeyEntry = await apiModel.findOne({ owner: userId });
        return !!apiKeyEntry;
    },

    verifyApiKey: async (apiKey) => {
        const apiKeys = await apiModel.find().populate('owner');
        for (const entry of apiKeys) {
            const isMatch = await bcrypt.compare(apiKey, entry.apiKey);
            if (isMatch && entry.owner) {
                return {
                    username: entry.owner.username,
                    //convert mongoose ObjectId to string
                    userId: entry.owner._id.toString(),
                    email: entry.owner.email
                }
            }
        }
        return null;
    }
};