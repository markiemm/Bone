const express = require('express');
const apiRouterV1 = express.Router();

apiRouterV1.use('/users', require('./users/apiUsersV1Router'));

module.exports = apiRouterV1;