const express = require('express');
const dashboardRouter = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../middlewares/auth');

dashboardRouter.get('/',
checkAuthenticated,
(req, res) => {
    res.render('dashboard/index', { user: req.user });
});

dashboardRouter.get('/domains',
checkAuthenticated,
(req, res) => {
    res.render('domains/index', { user: req.user });
});

dashboardRouter.get('/users',
checkAuthenticated,
(req, res) => {
    res.render('users/index', { user: req.user });
});

module.exports = dashboardRouter;