const express = require('express');
const postAPIRouter = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

postAPIRouter.post('/upload', (req, res) => {
    console.log(req.body);
    console.log(req.files);
    upload.single('file');
    res.send({ success: true, message: 'File uploaded successfully' });
});

module.exports = postAPIRouter;