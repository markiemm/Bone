const express = require('express');
const mainRouter = express.Router();
const { checkAdmin, checkAuthenticated, checkNotAuthenticated } = require('../middlewares/auth');

mainRouter.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});


mainRouter.use('/dashboard', checkAuthenticated, require('./main/dashboardRouter'));
mainRouter.use('/myaccount', checkAuthenticated, require('./myAccount/myAccountRouter'));
mainRouter.use('/admin', checkAuthenticated, checkAdmin, require('./admin/adminRouter'));
mainRouter.use('/upload', checkAuthenticated, require('./upload/uploadRouter'));


mainRouter.use('/login', checkNotAuthenticated, require('./auth/login'));
mainRouter.use('/logout', checkAuthenticated, require('./auth/logout'));


mainRouter.use('/api/v1', checkAuthenticated, require('./API/v1/apiRouter'));


mainRouter.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});


module.exports = mainRouter;