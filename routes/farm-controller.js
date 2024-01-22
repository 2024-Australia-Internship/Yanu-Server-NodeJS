const { Farm, User} = require('../models');

exports.registerPostMid = async (req, res) => {
    const {user_code, business_name, farmer_name, product_price, farm_phonenumber, farm_email, farm_address} = req.body;
    try{
        const registerFarm = await Farm.create({
            ...req.body
        });

        if(registerFarm) {
            res.status(201).json({success: true, message: '농장 등록 성공'});
        } else{
            res.status(400).json({success: false, message : '농장 등록 중 오류 발생'})
        }
    } catch(error){
        res.status(500).json({success : false, message : '농장 등록 중 서버 오류 발생'});
    }
}