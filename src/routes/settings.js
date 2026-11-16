const express = require('express');
const profileRouter = express.Router();
const logger = require('../utils/logger');
const { checkAuthenticated } = require('../middleware/auth');
const { changeUserPassword } = require('../components/userConfig');
const { passwordDashboardChangeValidator, validate } = require('../middleware/validators');
const userModel = require('../models/users');
const { createApiKey, userApiKey, regenerateApiKey } = require('../components/userConfig');
const { createNotification } = require('../components/notifications');




profileRouter.get('/profile', checkAuthenticated, (req, res) => {
  res.render('pages/settings/profile', { title: 'Profile', page: 'profile', user: req.user });
});


profileRouter.get('/security', checkAuthenticated, (req, res) => {
  res.render('pages/settings/security', { title: 'Security', page: 'security', user: req.user });
});

profileRouter.post('/security', checkAuthenticated, passwordDashboardChangeValidator,
  async (req, res) => {
    const method = req.query.method;
    switch (method) {
      case 'changePassword':
        {
          const {
            'currentPassword': currentPassword,
            'newPassword': newPassword,
            'confirmNewPassword': confirmNewPassword
          } = req.body;

          try {
            await changeUserPassword(req.user._id, currentPassword, newPassword);
            await createNotification(req.user._id, 'Password Changed', 'Your account password has been changed successfully.', 'security', true);
            req.flash('success_msg', 'Password changed successfully.');
            return res.redirect('/settings/security');
          } catch (error) {
            logger.error(`Error changing password for user ${req.user.username}: ${error.message}`);
            req.flash('error', error.message);
            return  res.redirect('/settings/security');
          }
        }
        break;
      default:
        req.flash('warning', 'Invalid method specified.');
        return res.redirect('/settings/security');
    }
});

profileRouter.get('/api', checkAuthenticated, async (req, res) => {
  const userKey = await userApiKey(req.user._id);
  res.render('pages/settings/api', { title: 'API Settings', page: 'api', user: req.user, userKey });
});

profileRouter.post('/api', checkAuthenticated, async (req, res) => {
  const method = req.query.method;
  switch (method) {
    case 'generateApiKey':
      {
        //check if user already has an api key
        const existingKey = await userApiKey(req.user._id);
        if (existingKey) {
          req.flash('warning', 'You already have an API key. Please revoke it before generating a new one.');
          return res.redirect('/settings/api');
        }
        try {
          const apiKey = await createApiKey(req.user._id);
          await createNotification(req.user._id, 'API Key Generated', 'A new API key has been generated for your account.', 'security', true);
          req.flash('success', `New API Key generated: ${apiKey}. Please store it securely as it will not be shown again.`);
          return res.render('pages/settings/api', { title: 'API Settings', page: 'api', user: req.user, newApiKey: apiKey });
        } catch (error) {
          logger.error(`Error generating API key for user ${req.user.username}: ${error.message}`);
          req.flash('error', 'Failed to generate API key. Please try again later.');
          return res.redirect('/settings/api');
        }
      }
      break;
    case 'regenerateApiKey':
      {
        try {
          const apiKey = await regenerateApiKey(req.user._id);
          await createNotification(req.user._id, 'API Key Regenerated', 'Your API key has been regenerated.', 'security', true);
          req.flash('success', `API Key regenerated: ${apiKey}. Please store it securely as it will not be shown again.`);
          return res.render('pages/settings/api', { title: 'API Settings', page: 'api', user: req.user, newApiKey: apiKey });
        } catch (error) {
          logger.error(`Error regenerating API key for user ${req.user.username}: ${error.message}`);
          req.flash('error', 'Failed to regenerate API key. Please try again later.');
          return res.redirect('/settings/api');
        }
      }
      break;
    default:
      req.flash('warning', 'Invalid method specified.');
      return res.redirect('/settings/api');
  }
});

module.exports = profileRouter;