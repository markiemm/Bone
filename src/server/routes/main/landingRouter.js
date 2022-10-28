const express = require('express');
const landingRouter = express.Router();
const { checkNotAuthenticated } = require('../../middlewares/auth');

landingRouter.get('/',
checkNotAuthenticated,
(req, res) => {
    res.render('landing/home', { user: req.user });
});

module.exports = landingRouter;