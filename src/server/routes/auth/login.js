const express = require('express');
const LoginRoute = express.Router();
const passport = require('passport');
const { checkNotAuthenticated } = require('../../middlewares/auth');


LoginRoute.post('/',
checkNotAuthenticated,

passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

module.exports = LoginRoute;
