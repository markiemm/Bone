const express = require('express');
const uploadRouter = express.Router();
const logger = require('../utils/logger');
const { checkAuthenticated } = require('../middleware/auth');
const { createUploadDatabaseEntry } = require('../components/upload');
const { storeFiles } = require('../components/upload');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const fs = require('fs');
const { shareX, webUpload } = require('../components/uploadDriver');
const { createNotification } = require('../components/notifications');
const { getUploadByShortId } = require('../components/database');

uploadRouter.get('/:shortId', async (req, res) => {
	const shortId = req.params.shortId;
	try {
		const upload = await getUploadByShortId(shortId);
		if (!upload) {
			return res.status(404).send('Upload not found');
		}
		res.render('pages/uploadDetails', { title: 'Upload Details', page: 'uploadDetails', user: req.user || null, upload: upload });
	} catch (error) {
		logger.error('Error fetching upload by shortId:', error);
		return res.status(500).send('An error occurred while fetching the upload');
	}
});

uploadRouter.get('/', checkAuthenticated, (req, res) => {
	res.render('pages/upload', { title: 'Upload Files', page: 'upload', user: req.user });
});

uploadRouter.post('/', checkAuthenticated, async (req, res) => {
	const client = req.user.client

	switch (client) {
		case 'sharex':
			try {
				shareX(req, res);
				createNotification(req.user.id, 'Upload Successful', 'Your files have been uploaded successfully.', 'upload', false);
			} catch (error) {
				logger.error('Error during ShareX upload:', error);
				return res.status(500).json({ error: 'An error occurred during ShareX upload.' });
			}
			break;
		case 'web':
			try {
				webUpload(req, res);
				createNotification(req.user._id, 'Upload Successful', 'Your files have been uploaded successfully.', 'upload', false);
			} catch (error) {
				logger.error('Error during file upload:', error);
				return res.status(500).json({ error: 'An error occurred during file upload.' });
			}
			break;
		default:
			return res.status(400).json({ error: 'Unsupported upload client' });
	}
});

module.exports = uploadRouter;