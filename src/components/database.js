const uploadModel = require('../models/media');
const ObjectId = require('mongoose').Types.ObjectId;
const prettyBytes = require('pretty-bytes');

module.exports = {
    getRecentUploadsForUser: async (userId) => {
        const uploads = await uploadModel.find({ owner: new ObjectId(userId) }).sort({ createdAt: -1 }).limit(5);
        const formattedSizeUploads = uploads.map(upload => {
            return {
                ...upload.toObject(),
                metadata: {
                    ...upload.metadata,
                    formattedSize: prettyBytes(upload.metadata.size)
                }
            };
        });
        return formattedSizeUploads;
    },

    getMetricsForUser: async (userId) => {
        const totalUploads = await uploadModel.countDocuments({ owner: new ObjectId(userId) });
        //display total storage used in bytes uisng the field {"metadata.size"}
        const totalStorageUsedResult = await uploadModel.aggregate([
            { $match: { owner: new ObjectId(userId) } },
            { $group: { _id: null, totalSize: { $sum: "$metadata.size" } } }
        ]);

        const totalStorageUsed = totalStorageUsedResult.length > 0 ? totalStorageUsedResult[0].totalSize : 0;

        const totalImages = await uploadModel.countDocuments({ 
            owner: new ObjectId(userId),
            'metadata.mimetype': { $regex: /^image\// }
        });

        const totalVideos = await uploadModel.countDocuments({ 
            owner: new ObjectId(userId),
            'metadata.mimetype': { $regex: /^video\// }
        });

        const totalLinks = await uploadModel.countDocuments({ 
            owner: new ObjectId(userId),
            'metadata.mimetype': 'link'
        });

        const totalFiles = await uploadModel.countDocuments({ 
            owner: new ObjectId(userId),
            'metadata.mimetype': { $not: { $regex: /^(image|video)\// }, $ne: 'link' }
        });

        return {
            totalUploads,
            totalStorageUsed,
            totalImages,
            totalVideos,
            totalLinks,
            totalFiles
        };
    },

    getUploadByShortId: async (shortId) => {
        const upload = await uploadModel.aggregate([
            { $match: { shortId: shortId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            { $unwind: '$ownerDetails' },
            {
                $project: {
                    _id: 1,
                    shortId: 1,
                    filename: 1,
                    storedFilename: 1,
                    createdAt: 1,
                    metadata: 1,
                    owner: {
                        _id: '$ownerDetails._id',
                        username: '$ownerDetails.username',
                        email: '$ownerDetails.email'
                    }
                }
            }
        ]);
        const formattedSize = upload.length > 0 ? prettyBytes(upload[0].metadata.size) : null;
        if (upload.length > 0) {
            upload[0].metadata.formattedSize = formattedSize;
        }

        if (upload.length === 0) {
            return null;
        }
        console.log('Fetched upload:', upload[0]);
        return upload[0];
    },

    getAllUploadsByUser: async (userId, client, sortBy, sortOrder, date, page) => {
        const query = { owner: new ObjectId(userId) };

        if (client) {
            query.client = client;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const limit = 20;
        const skip = page ? (parseInt(page) - 1) * limit : 0;

        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by createdAt descending
        }

        const uploads = await uploadModel.aggregate([
            { $match: query },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 0 } },
            //get username from users collection
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            { $unwind: '$ownerDetails' },
            {
                $project: {
                    shortId: 1,
                    filename: 1,
                    storedFilename: 1,
                    createdAt: 1,
                    metadata: 1,
                    owner: '$ownerDetails.username'
                }
            }

        ]);
        const formattedSizeUploads = uploads.map(upload => {
            return {
                ...upload,
                metadata: {
                    ...upload.metadata,
                    formattedSize: prettyBytes(upload.metadata.size)
                }
            };
        });
        return formattedSizeUploads;
    }
};