const express = require('express');
const adminRouter = express.Router();
const { checkAdmin } = require('../../middlewares/auth');

adminRouter.use('/users', checkAdmin, require('./users/usersRouter'));
adminRouter.use('/domains', checkAdmin, require('./domains/domainsRouter'));

module.exports = adminRouter;