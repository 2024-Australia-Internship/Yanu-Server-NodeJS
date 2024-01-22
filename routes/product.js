const router = require('express').Router();
const productsMiddleware = require('./product-controller');
const createCodeMiddleware = require('../middlewares/create_code');

router.post('/:user_code/create/info', createCodeMiddleware, productsMiddleware.createInfoPostMid);
router.get('/list', productsMiddleware.listGetMid);
router.get('/:product_code', productsMiddleware.productcodeGetMid);

module.exports = router;