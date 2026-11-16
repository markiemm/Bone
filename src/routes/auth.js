const express = require('express');
const authRouter = express.Router();
const logger = require('../utils/logger');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');
const passport = require('passport');

//redirect root to dashboard
authRouter.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('pages/auth/login', { title: 'Login' });
});

authRouter.post('/login',
    checkNotAuthenticated,
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }
));

authRouter.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            logger.error(`Logout Error: ${err}`);
            return next(err);
        }
        res.redirect('/login');
    });
});



module.exports = authRouter;