const router = require('express').Router();
const farmMiddleware = require('./farm-controller');

router.post('/register', farmMiddleware.registerPostMid);
router.post('/register/image/:user_code', farmMiddleware.registerImagePostMid);
module.exports = router;