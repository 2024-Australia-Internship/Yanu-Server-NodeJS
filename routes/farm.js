const router = require('express').Router();
const farmMiddleware = require('./farm-controller');

router.post('/register',  farmMiddleware.registerPostMid);

module.exports = router;