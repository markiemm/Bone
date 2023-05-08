const express = require('express');
const adminRouter = express.Router();


adminRouter.get('/', (req, res) => {
    res.render('admin/index', {
        title: 'Admin',
        user: req.user
    });
});

adminRouter.use('/users', require('./users/usersRouter'));
adminRouter.use('/domains', require('./domains/domainsRouter'));

module.exports = adminRouter;