const express = require('express');
const LoginRoute = express.Router();
const passport = require('passport');

LoginRoute.get('/',
(req, res) => {
    res.render('auth/login', { user: req.user });
});


LoginRoute.post('/',
passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));

module.exports = LoginRoute;
