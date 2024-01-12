const { User } = require('../models');

const saltRequired = async (req, res, next) => {
    const { user_email } = req.body;
    try{
        const user = await User.findOne({
            attributes: ['user_salt'],
            where: {user_email}
        });

        if(user) {
            const salt = user.dataValues.user_salt.toString();
            req.salt = salt;
            next();
        } else {
            res.json({message : ' 아이디가 일치하지 않음'});
        }
    } catch(error) {
        console.log('saltedReqruied 미들웨어 오류:', error);
        res.json({message : '서버 오류'});
    }
}

module.exports = saltRequired