const express = require('express');
const myAccountRouter = express.Router();
const domainModel = require('../../models/domains');

myAccountRouter.get('/', (req, res) => {
    const domain_model = domainModel.find({});

    Promise.all([domain_model]).then((results) => {

        res.render('myAccount/index',
            {
                user: req.user,
                domains: results[0]
            }
        );
    });
});



module.exports = myAccountRouter;