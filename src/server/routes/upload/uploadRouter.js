const express = require('express');
const postAPIRouter = express.Router();
const postModel = require('../../models/posts');



postAPIRouter.post('/', (req, res) => {
    console.log(req.files.upload);
    console.log(req.body);
    const fileName = req.files.upload.name;
    const filePath = `./uploads/${fileName}`;
    const file = req.files.upload;
    const post_model = postModel.find({domain: req.headers.host});

    Promise.all([post_model]).then((result) => {

        if (result[0].length === 0) {




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
                    res.send({"status": "success", "url": `${result[0][0].HTTPS ? 'https' : 'http'}://${result[0][0].domain}/${fileName}`});
                }
            });

        } else {
            res.status(400).send('Uploading to this domain is not allowed, if you are the administator then create the domain in the admin panel');
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