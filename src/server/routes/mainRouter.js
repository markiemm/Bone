const express = require('express');
const mainRouter = express.Router();

mainRouter.use('/', require('./main/landingRouter'));

mainRouter.use('/dashboard', require('./main/dashboardRouter'));
mainRouter.use('/myaccount', require('./myAccount/myAccountRouter'));
mainRouter.use('/admin', require('./admin/adminRouter'));
mainRouter.use('/upload', require('./upload/uploadRouter'));


mainRouter.use('/login', require('./auth/login'));
mainRouter.use('/logout', require('./auth/logout'));


mainRouter.use('/api', require('./API/apiRouter'));


mainRouter.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});


module.exports = mainRouter;