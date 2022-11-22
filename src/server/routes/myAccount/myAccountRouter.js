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

myAccountRouter.post('/create-sharex-config', (req, res) => {
    const title = req.body.name;
    const domain = req.body.domain;
    console.log(req.body);

    const sharex_config = {
        "Name": title,
        "DestinationType": "ImageUploader, FileUploader",
        "RequestType": "POST",
        "RequestURL": "https://api." + domain + "/upload",
        "FileFormName": "upload",
    };

    res.setHeader('Content-disposition', 'attachment; filename=' + title + '.sxcu');
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(sharex_config));
    res.end();
});





module.exports = myAccountRouter;