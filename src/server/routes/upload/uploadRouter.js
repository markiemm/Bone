const express = require('express');
const postAPIRouter = express.Router();
const postModel = require('../../models/posts');
const userModel = require('../../models/users');



postAPIRouter.post('/', (req, res) => {
    const post_model = postModel.find({domain: req.headers.host});
    const user_model = userModel.find({api_key: req.headers.api_key});

    Promise.all([post_model, user_model]).then((values) => {
        const fileName = req.files.upload.name;
        const file = req.files.upload;
        const filePath = `./src/server/storage/${values[1][0].id}/${fileName}`;


        const create_Database_Entry = async () => {
            const newPost = new postModel({
                type: file.mimetype,
                path: filePath,
                name: fileName,
                date: Date.now(),
                user: values[1][0].id,
                size: file.size
            });
            await newPost.save();
        };

        switch (file.mimetype) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif': 
                file.mv(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        create_Database_Entry();
                        res.send('File uploaded!');
                    }
                });
                break;
            case 'video/mp4':
            case 'video/webm':
            case 'video/ogg':
            case 'video/avi':
            case 'video/mov':
            case 'video/wmv':
            case 'video/flv':
            case 'video/mkv':
                file.mv(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        create_Database_Entry();
                        res.send('File uploaded!');
                    }
                });
                break;
            case 'text/plain':
            case 'text/html':
            case 'text/css':
            case 'text/javascript':
            case 'text/json':
            case 'text/xml':
            case 'text/yaml':
            case 'text/csv':
            case 'text/markdown':
                file.mv(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send
                    } else {
                        create_Database_Entry();
                        res.send('File uploaded!');
                    }
                });
                break;
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