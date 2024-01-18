const router = require('express').Router();
const productsMiddleware = require('./product-controller');
const createCodeMiddleware = require('../middlewares/create_code');

router.post('/:user_code/create', createCodeMiddleware, productsMiddleware.createPostMid);

module.exports = router;