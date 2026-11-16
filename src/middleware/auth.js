const { verifyApiKey } = require('../components/userConfig');
module.exports = {
    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard');
        }
        next();
    },

    checkAuthenticated: async (req, res, next) => {
        //if user-agent is share "Sharex/*", go through api key authentication flow

        function isShareX(userAgent) {
            return /ShareX\/[0-9]+\.[0-9]+\.[0-9]+/i.test(userAgent);
        }

        if (isShareX(req.headers['user-agent'])) {
            if (req.headers['x-api-key'] && await verifyApiKey(req.headers['x-api-key'])) {
                //pass user info to req.user
                const user = await verifyApiKey(req.headers['x-api-key']);
                req.user = user;
                req.user.id = user.userId;
                req.user.client = 'sharex';
                return next();
            } else {
                return res.status(401).json({ error: 'Invalid API key' });
            }
        }

        if (req.isAuthenticated()) {
            req.user.client = 'web';
            return next();
        }

        // console.log('Checking authentication for request to:', req.originalUrl);
        // console.log(req.headers);
        // if (req.isAuthenticated() || (req.headers['x-api-key'] && await verifyApiKey(req.headers['x-api-key']))) {
        //     return next();
        // }
        req.flash('warning_msg', 'Please log in to view that resource');
        return res.redirect('/login');
    },
}