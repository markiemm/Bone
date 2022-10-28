const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Usermodel = require('../models/users');
const moment = require('moment');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            // Match user
            Usermodel.findOne({
                username: username
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Your username or password is incorrect.' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        Usermodel.findOneAndUpdate({ username: username }, { last_login: Date.now() }, { new: true }, (err, doc) => {
                            if (err) {
                                return done(null, false, { message: 'Error updating last login, please try again later.' });
                            }
                        });
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Your username or password is incorrect.' });
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Usermodel.findById(id, function(err, user) {
            done(err, user);
        });
    });
}