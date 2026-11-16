const notificationModel = require('../models/notifications');

async function createNotification(userId, title, message, type, important = false) {
    const notification = new notificationModel({
        user: userId,
        title,
        message,
        type,
        important
    });
    await notification.save();
    return notification;
}

async function getUserNotifications(userId, limit, unreadOnly = false) {
    //return { notifications: [], notificationsCount: Number, unreadCount: Number }; // Placeholder
    return await notificationModel.aggregate([
        { $match: { user: userId } },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
        ...(unreadOnly ? [{ $match: { read: false } }] : []),
        {
            $facet: {
                notifications: [
                    { $project: { notificationId: '$_id', title: 1, message: 1, type: 1, read: 1, createdAt: 1, important: 1 } }
                ],
                notificationsCount: [
                    { $count: 'count' }
                ],
                unreadCount: [
                    { $match: { read: false } },
                    { $count: 'count' }
                ]
            }
        },
        {
            $project: {
                notifications: 1,
                notificationsCount: { $arrayElemAt: ['$notificationsCount.count', 0] },
                unreadCount: { $arrayElemAt: ['$unreadCount.count', 0] }
            }
        }
    ]).then(results => {
        if (results.length > 0) {
            return {
                notifications: results[0].notifications,
                notificationsCount: results[0].notificationsCount || 0,
                unreadCount: results[0].unreadCount || 0
            };
        } else {
            return {
                notifications: [],
                notificationsCount: 0,
                unreadCount: 0
            };
        }
    });
}

async function markNotificationAsRead(notificationId) {
    return await notificationModel.findByIdAndUpdate(notificationId, { read: true });
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead
};