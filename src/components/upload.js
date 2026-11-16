const uploadModel = require('../models/media');
const path = require('path');
const fs = require('fs');

module.exports = {
    createUploadDatabaseEntry: async (data, userId, timestamp, client) => {
        const { originalName, mimetype, size, md5, encoding } = data;
        try {
            const newUpload = new uploadModel({
                owner: userId,
                filename: originalName,
                storedFilename: timestamp + '-' + originalName,
                metadata: {
                    mimetype: mimetype,
                    size: size,
                    md5: md5,
                    encoding: encoding
                },
                client: client || 'web'
            });
            await newUpload.save();
            return newUpload;
        } catch (error) {
            throw new Error('Error creating upload database entry: ' + error.message);
        }
    },

    storeFiles: async (files, username, date) => {
        const storedFiles = [];
        const userStoragePath = path.join(__dirname, '../../storage/', username, 'uploads');
        if (!fs.existsSync(userStoragePath)){
            fs.mkdirSync(userStoragePath, { recursive: true });
        }

        for (const fileKey in files) {
            const file = files[fileKey];
            const savePath = path.join(userStoragePath, date + '-' + file.name);

            // Move the file to the user's storage folder
            await file.mv(savePath);
            storedFiles.push({
                originalName: file.name,
                storedPath: savePath,
                size: file.size,
                mimetype: file.mimetype,
                md5: file.md5,
                encoding: file.encoding
            });
        }

        return storedFiles;
    }
};