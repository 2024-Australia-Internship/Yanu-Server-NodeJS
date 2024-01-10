const router = require('express').Router();
const usersMiddleware = require('./user-controller');

router.post('/register', usersMiddleware.registerPostMid);

module.exports = router;