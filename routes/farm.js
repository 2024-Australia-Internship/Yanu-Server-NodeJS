const router = require('express').Router();
const farmMiddleware = require('./farm-controller');
const createCodeMiddleware = require('../middlewares/create_code');

router.post('/register', createCodeMiddleware, farmMiddleware.registerPostMid);
router.post('/register/image/:user_code', farmMiddleware.registerImagePostMid);
module.exports = router;