const express = require('express');
const notificationsRouter = express.Router();
const notificationModel = require('../models/notifications');
const { checkAuthenticated } = require('../middleware/auth');
const { getUserNotifications, markNotificationAsRead } = require('../components/notifications');

notificationsRouter.get('/', checkAuthenticated, async (req, res) => {
    res.send('Notifications Home');
});

notificationsRouter.get('/get', checkAuthenticated, async (req, res) => {
    const limit = parseInt(req.query.limit) || undefined;
    const unreadOnly = req.query.unreadonly === 'true' ? true : false;
    const notifications = await getUserNotifications(req.user._id, limit, unreadOnly);
    res.send({
        status: 'success',
        data: notifications
    });
});

notificationsRouter.post('/markRead', checkAuthenticated, async (req, res) => {
    const { notificationId } = req.body;
    try {
        await markNotificationAsRead(notificationId);
        res.send({ status: 'success', message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Failed to mark notification as read' });
    }
});

notificationsRouter.post('/markAllRead', checkAuthenticated, async (req, res) => {
    try {
        await notificationModel.updateMany({ user: req.user._id, read: false }, { read: true });
        res.send({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Failed to mark all notifications as read' });
    }
});

module.exports = notificationsRouter;