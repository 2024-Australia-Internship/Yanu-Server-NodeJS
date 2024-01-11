const router = require('express').Router();
const usersMiddleware = require('./user-controller');
const saltMiddleware = require('../middlewares/salt');

router.post('/register', usersMiddleware.registerPostMid);
router.post('/login', saltMiddleware, usersMiddleware.loginPostMid);

module.exports = router;