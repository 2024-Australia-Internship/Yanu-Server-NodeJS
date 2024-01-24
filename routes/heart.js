const router = require('express').Router();
const heartMiddleware = require('./heart-controller');

router.post('/:code', heartMiddleware.heartPostMid);        // 상품이면 상품코드를, 농장이면 농장코드를 넘겨주면 됨
router.delete('/:user_code/:product_code', heartMiddleware.heartDeleteMid);
router.get('/:user_code/product', heartMiddleware.heartProductGetMid);
router.get('/:user_code/farm', heartMiddleware.heartFarmGetMid);

module.exports = router;