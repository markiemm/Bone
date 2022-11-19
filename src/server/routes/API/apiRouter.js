const express = require('express');
const apiRouter = express.Router();

apiRouter.use('/post', require('./post/postAPIRouter'));

module.exports = apiRouter;