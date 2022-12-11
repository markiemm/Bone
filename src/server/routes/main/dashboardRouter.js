const express = require('express');
const dashboardRouter = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../middlewares/auth');
const postModel = require('../../models/posts');

dashboardRouter.get('/',
checkAuthenticated,
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