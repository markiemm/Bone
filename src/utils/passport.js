const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/users');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const randomstring = require('randomstring');
const moment = require('moment');


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            //Match user
            User.findOne({ username: username })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'The username or password is incorrect.' });
                    }

                    if (user.banned) {
                        return done(null, false, { message: 'This account has been suspended.' });
                    }

                    //Match passwords
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'The username or password is incorrect.' });
                        }
                    })

            })
              
        })
    )

    // passport.use(
    //     new GoogleStrategy({
    //         clientID: process.env.GOOGLE_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //         callbackURL: process.env.GOOGLE_CALLBACK_URL,
    //         passReqToCallback: true
    //     },
    //         function (request, accessToken, refreshToken, profile, done) {
    //             console.log(profile);
    //             User.findOne({ googleId: profile.id })
    //                 .then((user) => {
    //                     if (user) {
    //                         return done(null, user);
    //                     } else {
    //                         User.findOne({ GoogleId: profile.id })
    //                             .then((user) => {
    //                                 if (user) {
    //                                     console.log('user found');
    //                                     return done(null, user);
    //                                 } else {
    //                                     console.log('user not found, creating new user');
    //                                     const newUser = new User({
    //                                         accountType: 'google',
    //                                         googleId: profile.id,
    //                                         username: profile.displayName,
    //                                         email: profile.emails[0].value,
    //                                         avatar: profile.photos[0].value,
    //                                         last_ip: request.ip,
    //                                         registration_ip: request.ip,
    //                                         useragent: request.headers['user-agent'],
    //                                         bio: "Hi, I'm new here. I'm looking for a new home.",
    //                                         API_token: randomstring.generate(30),
    //                                         role: "member",
    //                                         banned: false,
    //                                         created: moment().toISOString(),
    //                                         last_login: moment().toISOString(),
    //                                         preferences: { "darkmode": false },
    //                                         notifications: [],
    //                                         twofa: {
    //                                             TOTP: {
    //                                                 enabled: false,
    //                                                 keys: []
    //                                             }
    //                                         }
    //                                     });
    //                                     newUser.save()
    //                                         .then((user) => {
    //                                             setTimeout(() => {
    //                                                 return done(null, user);
    //                                             }, 1000);
    //                                         }).catch((err) => {
    //                                             console.log(err);
    //                                             Sentry.captureException(err)
    //                                         }
    //                                     )}
    //                             }).catch((err) => {
    //                                 console.log(err);
    //                                 Sentry.captureException(err)
    //                             })
    //                     }
    //                 }).catch((err) => {
    //                     console.log(err);
    //                     Sentry.captureException(err)
    //                 })
    //         }))
                           

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    })
}