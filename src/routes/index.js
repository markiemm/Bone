const express = require('express');
const indexRouter = express.Router();
const logger = require('../utils/logger');
const { checkAuthenticated } = require('../middleware/auth');

//redirect root to dashboard
indexRouter.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

module.exports = indexRouter;