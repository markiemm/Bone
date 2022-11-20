const express = require('express');
const postAPIRouter = express.Router();


postAPIRouter.post('/upload', (req, res) => {
    console.log(req.files.test);
    console.log(req.body);
    const fileName = req.files.test.name;
    const filePath = `./uploads/${fileName}`;
    const file = req.files.test;
    file.mv(filePath, async err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        } else {
            res.send('File uploaded!');
        }
    });
});


module.exports = postAPIRouter;