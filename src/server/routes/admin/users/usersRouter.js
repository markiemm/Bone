const express = require('express');
const usersRouter = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../../../middlewares/auth');
const domainModal = require('../../../models/domains');
const userModal = require('../../../models/users');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

usersRouter.get('/',
checkAuthenticated,
(req, res) => {
    userModal.find({}, (err, accounts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('admin/users/index', { accounts: accounts, user: req.user });
        }
    });
});

usersRouter.post('/add',
checkAuthenticated,
(req, res) => {
    const { username, email, password, admin } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const GeneratedApiKey = randomstring.generate(32);


    const newUser = new userModal({
        username: username,
        email: email,
        password: hashedPassword,
        admin: admin,
        api_key: GeneratedApiKey
        
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/dashboard/users');
        }
    });
});

usersRouter.delete('/delete/:postid',
checkAuthenticated,
(req, res) => {
    const { postid } = req.params;

    domainModal.findByIdAndDelete(postid, (err, domain) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).send('Domain deleted successfully');
        }
    });
});

module.exports = usersRouter;