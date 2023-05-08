const express = require('express');
const dashboardRouter = express.Router();
const postModel = require('../../models/posts');

dashboardRouter.get('/',
(req, res) => {
    postModel.find({ user: req.user._id }, (err, posts) => {
        if (err) {
            console.log(err);
        } else {

            res.render('dashboard/index',
                {
                    user: req.user,
                    posts: posts
                }
            );
        }
    });

});


module.exports = dashboardRouter;