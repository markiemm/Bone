const express = require('express');
const usersRouter = express.Router();
const userModel = require('../../../models/users');

usersRouter.get('/', (req, res) => {
    try {
        userModel.find({}, (err, users) => {
            if (err) {
                console.log(err);
                res.render('status/500', {
                    title: '500 Internal Server Error',
                    header: '500 Internal Server Error',
                    message: 'An error occurred while trying to fetch users from the database.',
                    user: req.user
                });
            } else {
                res.render('admin/users', {
                    title: 'Users',
                    user: req.user,
                    users: users
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.render('status/500', {
            title: '500 Internal Server Error',
            header: '500 Internal Server Error',
            message: 'An error occurred while trying to fetch users from the database.',
            user: req.user
        });
    }
});

usersRouter.get('/add', (req, res) => {
    res.render('admin/addPages/addUser', {
        title: 'Add User',
        user: req.user
    });
});



module.exports = usersRouter;