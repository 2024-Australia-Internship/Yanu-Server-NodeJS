const router = require('express').Router();
const productsMiddleware = require('./product-controller');
const createCodeMiddleware = require('../middlewares/create_code');

router.post('/:user_code/create/info', createCodeMiddleware, productsMiddleware.createInfoPostMid);
router.post('/:user_code/create/image/:product_code', productsMiddleware.createImagePostMid)
router.get('/list', productsMiddleware.listGetMid);
router.get('/:user_code/:product_code', productsMiddleware.productcodeGetMid);
router.get('/:user_code', productsMiddleware.usercodeGetMid);

module.exports = router;