const { createUploadDatabaseEntry, storeFiles } = require('../components/upload');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const { createNotification } = require('../components/notifications');


module.exports = {
    shareX: async (req, res) => {
        try {
            const userUsername = req.user.username;
            const userId = req.user.id;
            const date = new Date().getTime().toString();
            const storedFiles = await storeFiles(req.files, userUsername, date);
            
            const file = storedFiles[0];

            const dbEntry = await createUploadDatabaseEntry({
                originalName: file.originalName,
                mimetype: file.mimetype,
                size: file.size,
                md5: file.md5,
                encoding: file.encoding
            }, userId, date, 'ShareX');
            
            return res.status(200).json({ 
                url: `${req.protocol}://${req.get('host')}/upload/${dbEntry.shortId}`,
                message: 'File uploaded successfully',
                size: file.size,
                mimetype: file.mimetype,
                thumbnail_url: `${req.protocol}://${req.get('host')}/upload/${dbEntry.shortId}/thumbnail`,
                delete_url: `${req.protocol}://${req.get('host')}/upload/${dbEntry.shortId}?delete=true`
            });
        } catch (error) {
            logger.error('Error storing uploaded file:', error);
            return res.status(500).json({ error: 'Error storing file' });
        }
    },

    webUpload: async (req, res) => {

        const timestamp = Date.now().toString();

        if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).json({ error: 'No files were uploaded.' });
		}

        const filesArray = Object.values(req.files);
        const storedFiles = await storeFiles(filesArray, req.user.username, timestamp);

        const dbEntries = [];

        for (const storedFile of storedFiles) {
            const dbEntry = await createUploadDatabaseEntry(storedFile, req.user._id, timestamp, 'web');
            dbEntries.push(dbEntry);
        }
        return res.status(200).json({ files: dbEntries });
    }
};