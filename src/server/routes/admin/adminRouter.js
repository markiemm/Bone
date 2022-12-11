const express = require('express');
const adminRouter = express.Router();
const { checkAdmin } = require('../../middlewares/auth');

adminRouter.get('/', checkAdmin, (req, res) => {
    res.render('admin/index', {
        title: 'Admin',
        user: req.user
    });
});

adminRouter.use('/users', checkAdmin, require('./users/usersRouter'));
adminRouter.use('/domains', checkAdmin, require('./domains/domainsRouter'));

module.exports = adminRouter;