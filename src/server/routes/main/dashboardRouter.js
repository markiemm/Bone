const express = require('express');
const dashboardRouter = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../middlewares/auth');

dashboardRouter.get('/',
checkAuthenticated,
(req, res) => {
    res.render('dashboard/index', { user: req.user });
});

dashboardRouter.use('/domains', require('./domains/domainsRouter'));
dashboardRouter.use('/users', require('./users/usersRouter'));


module.exports = dashboardRouter;