const {User} = require('../models');
const crypto = require('crypto');

exports.registerPostMid = async (req, res) => {
    try{
        const {user_email, user_pw, user_phonenumber} = req.body;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = crypto.pbkdf2Sync(user_pw, salt, 8754, 64, 'sha512').toString('hex');
        const newUser = await User.create({
            user_email : user_email,
            user_pw : hashedPassword,
            user_salt : salt,
            user_phonenumber : user_phonenumber,
        });
        res.json({message : '회원가입 성공'});
    } catch (error){
        console.log('회원가입 실패: ', error.message);
        res.json({mesage : '회원가입 실패'});
    }
};

/*exports.loginPostMid = (req, res) => {
    const { user_id, user_pw } = req.body;
    let salt = req.salt;
    crypto.pbkdf2(user_pw, salt, 8745, 64, "sha512", (err, key) => {
        if (err) {
            console.log(err);
            return;
        } else {
            db.query('SELECT user_id, user_pw from user where user_id = ? AND user_pw = ?', [user_id, key], (err, result) => {
                if (result.length === 1){
                    return res.json(result[0].user_id);     //로그인 성공 시 user_id 정보 보내주기
                } else if (result.length === 0){
                    return res.json({ message: '아이디나 비밀번호가 일치하지 않음' }); 
                }  else if (err){
                    return res.json({message : '로그인 실패'});
                }
            })
        }
    })
};*/