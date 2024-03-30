const router = require('express').Router();
const productsMiddleware = require('../controller/product');

router.post('/info', productsMiddleware.infoPostMid);
router.post('/image', productsMiddleware.imagePostMid)
router.get('', productsMiddleware.productGetMid);
router.get('/:user_id', productsMiddleware.userGetMid);
router.get('/search/:keyword', productsMiddleware.productSearchGetMid);
router.get('/search/:product_category/:keyword', productsMiddleware.productCategorySearchGetMid);
router.get('/:user_id/:product_code', productsMiddleware.productcodeGetMid);
// router.patch('/:user_id', productsMiddleware.productPatchMid);
// router.delete('/:user_id', productsMiddleware.productDeleteMid);

module.exports = router;