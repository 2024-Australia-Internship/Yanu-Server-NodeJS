const { Product } = require('../models');

exports.createInfoPostMid = async (req, res) => {
    const {product_title, product_category, product_hashtag, product_price, product_weight, product_unit,  product_description} = req.body;
    const user_code = req.params.user_code;
    const product_code = req.code;

    try{
        const createProduct = await Product.create({
            user_code : user_code,
            product_code : product_code,
            ...req.body
        });
        res.status(201).json({success: true, message: '제품 등록 성공'});
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류로 제품 등록 실패' });
    }

}