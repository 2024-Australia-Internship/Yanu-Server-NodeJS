const router = require('express').Router();
const usersMiddleware = require('./user-controller');
const saltMiddleware = require('../middlewares/salt');

router.post('/register', usersMiddleware.registerPostMid);
router.post('/login', saltMiddleware, usersMiddleware.loginPostMid); 
router.post('/check/email', usersMiddleware.checkEmailPostMid);

module.exports = router;