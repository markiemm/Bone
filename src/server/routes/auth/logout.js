const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    req.logout(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});


module.exports = logoutRouter;
