const express = require('express');
const dashboardRouter = express.Router();
const logger = require('../utils/logger');
const { checkAuthenticated } = require('../middleware/auth');
const { getRecentUploadsForUser, getMetricsForUser, getAllUploadsByUser } = require('../components/database');
const prettyBytes = require('pretty-bytes');
const createError = require('http-errors');

dashboardRouter.get('/', checkAuthenticated, (req, res) => {
  res.render('pages/dashboard/overview', { title: 'Dashboard', page: 'dashboard' });
});

dashboardRouter.get('/recentuploads', checkAuthenticated, (req, res) => {
    getRecentUploadsForUser(req.user.id).then(uploads => {
        res.json({
            user: req.user.username,
            uploads
        });
    }).catch(error => {
        logger.error('Error fetching recent uploads:', error);
        res.status(500).json({ error: 'Error fetching recent uploads' });
    });
});

dashboardRouter.get('/metrics', checkAuthenticated, (req, res) => {
    getMetricsForUser(req.user.id).then(metrics => {
        metrics.totalStorageUsedFormatted = prettyBytes(metrics.totalStorageUsed);
        res.json({ metrics });
    }).catch(error => {
        logger.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Error fetching metrics' });
    });
});

dashboardRouter.get('/config-generator', checkAuthenticated, (req, res) => {
    res.render('pages/configGenerator/index', { title: 'Config Generator', page: 'config-generator', user: req.user });
});

dashboardRouter.get('/config-generator/:client', checkAuthenticated, (req, res, next) => {
    const client = req.params.client;
    switch (client) {
        case 'sharex':
            return res.render('pages/configGenerator/sharex', { title: 'Config Generator - ShareX', page: 'config-generator', user: req.user });
        default:
            next(createError(404));
    }
});

dashboardRouter.get('/media', checkAuthenticated, (req, res) => {
    res.render('pages/dashboard/media', { title: 'Media Library', page: 'media' });
});

dashboardRouter.get('/getmedia', checkAuthenticated, (req, res) => {
    const { client, sortBy, sortOrder, date, page } = req.query;
    getAllUploadsByUser(req.user.id, client, sortBy, sortOrder, date, page).then(uploads => {
        res.json({
            uploads
        });
    }).catch(error => {
        logger.error('Error fetching media:', error);
        res.status(500).json({ error: 'Error fetching media' });
    });
});

module.exports = dashboardRouter;