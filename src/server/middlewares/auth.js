
module.exports = {
    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        next();
    },

    checkAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },

    checkAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.admin && req.hostname === process.env.ADMIN_DOMAIN) {
            return next();
        }
        res.redirect('/');
    }
}