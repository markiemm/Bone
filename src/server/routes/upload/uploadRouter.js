const express = require('express');
const postAPIRouter = express.Router();
const postModel = require('../../models/posts');



postAPIRouter.post('/', (req, res) => {
    console.log(req.files.upload);
    console.log(req.body);
    const fileName = req.files.upload.name;
    const filePath = `./uploads/${fileName}`;
    const file = req.files.upload;

    const create_Database_Entry = async () => {
        const newPost = new postModel({
            type: file.mimetype,
            path: filePath,
            name: fileName,
            date: Date.now(),
            user: req.body.user,
            size: file.size
        });
        await newPost.save();
    };

    file.mv(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            create_Database_Entry();
            res.send('File uploaded!');
        }
    });
});




    // file.mv(filePath, async err => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).send(err);
    //     } else {
    //         res.send('File uploaded!');
    //     }
    // });


module.exports = postAPIRouter;