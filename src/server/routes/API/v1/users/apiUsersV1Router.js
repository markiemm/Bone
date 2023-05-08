const express = require('express');
const apiUsersV1Router = express.Router();
const Usermodel = require('../../../../models/users');
const bcrypt = require('bcrypt');

apiUsersV1Router.post('/add', (req, res) => {
    console.log(req.body);
    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    const Newuser = {
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword,
        admin: req.body.admin,
        quota: req.body.quota,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    Usermodel.create(Newuser, (err, user) => {
        if (err) {
            res.status(500).json({
                message: 'Error creating user',
                error: err
            });
        } else {
            req.flash('success', 'User created successfully');
            res.redirect('/admin/users');
        }
    });
});

module.exports = apiUsersV1Router;