// validators.js
const { body, validationResult } = require("express-validator");

const passwordDashboardChangeValidator = [
    body()
    .custom((value, { req }) => {
        if (!req.body.currentPassword || !req.body.newPassword || !req.body.confirmNewPassword) {
            throw new Error('All password fields are required');
        }
        return true;
    }),
    //ignore other rules if above fails

    body('currentPassword')
    .bail()
    .notEmpty().withMessage('Current password is required'),


    body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .bail(),


    body('confirmNewPassword')
    .bail()
    .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('New password and confirm password do not match');
        }
        return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = [];

        errors.array().map(err => extractedErrors.push({ "msg": err.msg }));
        req.flash('error', extractedErrors.map(e => e.msg).join(' , '));
        return res.redirect('/settings/security');

        // return res.status(400).json({
        //     success: false,
        //     msg: "There was some errors validating your request",
        //     errors: extractedErrors
        // });
    }
];


module.exports = {
    passwordDashboardChangeValidator
};
