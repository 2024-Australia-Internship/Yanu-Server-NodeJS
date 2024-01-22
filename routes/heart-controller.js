const {Heart} = require('../models');

exports.heartPostMid = async (req, res) => {
    const product_code = req.params.product_code;
    const user_code = req.body.user_code;
    try{
        const createHeart = await Heart.create({
            product_code : product_code, 
            user_code : user_code
        });
        if(createHeart){
            res.status(201).json({success: true, message: '하트 등록 성공'});
        } else{
            res.status(400).json({success: false, message : '하트 등록 중 오류 발생'})
        }
    } catch(error){
        console.log(error);
        res.status(500).json({success : false, message : '하트 등록 중 서버 오류 발생'});
    }
}
