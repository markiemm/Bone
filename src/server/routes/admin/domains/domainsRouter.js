const express = require('express');
const domainsRouter = express.Router();

domainsRouter.get('/', (req, res) => {
    res.render('admin/domains', {
        title: 'Domains',
        user: req.user
    });
});

domainsRouter.get('/add', (req, res) => {
    res.render('admin/addPages/addDomain', {
        title: 'Add Domain',
        user: req.user
    });
});



module.exports = domainsRouter;