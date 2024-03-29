const router = require('express').Router();
const productsMiddleware = require('./product-controller');

router.post('/:user_code/create/info', productsMiddleware.createInfoPostMid);
router.post('/:user_code/create/image/:product_code', productsMiddleware.createImagePostMid)
router.get('/list', productsMiddleware.listGetMid);
router.get('/search/:keyword', productsMiddleware.productSearchGetMid);
router.get('/search/:product_category/:keyword', productsMiddleware.productCategorySearchGetMid);
router.get('/:user_code/:product_code', productsMiddleware.productcodeGetMid);
router.get('/:user_code', productsMiddleware.usercodeGetMid);

module.exports = router;