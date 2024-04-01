const { User } = require('../models'); 

const saltRequired = async (req, res, next) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({
            attributes: ['password_salt'],
            where: {email}
        });

        if(user) {
            const salt = user.dataValues.password_salt.toString();
            req.salt = salt;
            next();
        } else {
            res.status(404).json({success : false, message : ' 아이디가 일치하지 않음'});
        }
    } catch(error) {
        console.log('saltedReqruied 미들웨어 오류:', error);
        res.status(500).json({success : false , message : '서버 오류'});
    }
}

module.exports = saltRequired