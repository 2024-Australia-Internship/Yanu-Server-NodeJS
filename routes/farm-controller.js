const { Farm, User} = require('../models');

exports.registerPostMid = async (req, res) => {
    try{
        const user_code = req.body.user_code;
        const user = await User.findOne({ where: { user_code } });
        const registerFarm = await Farm.create({
            ...req.body
        });

        if(registerFarm) {
            await user.update({ is_farmer: true });
            res.status(201).json({success: true, message: '농장 등록 성공'});
        } else{
            res.status(400).json({success: false, message : '농장 등록 중 오류 발생'})
        }
    } catch(error){
        console.log(error)
        res.status(500).json({success : false, message : '농장 등록 중 서버 오류 발생'});
    }
}