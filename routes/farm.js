const router = require('express').Router();
const farmMiddleware = require('./farm-controller');
const createCodeMiddleware = require('../middlewares/create_code');

router.post('/register', createCodeMiddleware, farmMiddleware.registerPostMid);

module.exports = router;