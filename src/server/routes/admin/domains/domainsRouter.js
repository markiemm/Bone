const express = require('express');
const dashboardRouter = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../../middlewares/auth');
const domainModal = require('../../../models/domains');

dashboardRouter.get('/',
checkAuthenticated,
(req, res) => {
    domainModal.find({}, (err, domains) => {
        if (err) {
            console.log(err);
        } else {
            res.render('admin/domains/index', {
                domains: domains,
                user: req.user
            });
        }
    });
});

dashboardRouter.post('/add',
checkAuthenticated,
(req, res) => {
    const { isDefault, domain, active, HTTPS } = req.body;

    const newDomain = new domainModal({
        domain,
        active,
        isDefault,
        HTTPS
    });

    newDomain.save()
    .then(() => {
        res.status(200).send('Domain added successfully');
    })
    .catch(err => function() {
        console.log(err);
        res.status(500).send('Server error');
    });
});

dashboardRouter.delete('/delete/:postid',
checkAuthenticated,
(req, res) => {
    const { postid } = req.params;

    domainModal.findByIdAndDelete(postid, (err, domain) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).send('Domain deleted successfully');
        }
    });
});

module.exports = dashboardRouter;