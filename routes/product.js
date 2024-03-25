const router = require('express').Router();
const productsMiddleware = require('./product-controller');

router.post('/create/info', productsMiddleware.createInfoPostMid);
router.post('/create/image', productsMiddleware.createImagePostMid)
router.get('/list', productsMiddleware.listGetMid);
router.get('/search/:keyword', productsMiddleware.productSearchGetMid);
router.get('/search/:product_category/:keyword', productsMiddleware.productCategorySearchGetMid);
router.get('/:user_id/:product_code', productsMiddleware.productcodeGetMid);
router.get('/:user_id', productsMiddleware.usercodeGetMid);

module.exports = router;