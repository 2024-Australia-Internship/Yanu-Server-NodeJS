const router = require('express').Router();
const heartMiddleware = require('./heart-controller');

router.post('/:product_code', heartMiddleware.heartPostMid);
router.delete('/:product_code', heartMiddleware.heartDeleteMid);

module.exports = router;