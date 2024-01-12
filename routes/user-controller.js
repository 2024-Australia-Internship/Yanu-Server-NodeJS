const { User } = require('../models');
const crypto = require('crypto');

exports.registerPostMid = async (req, res) => {
    try {
        const { user_email, user_pw, user_phonenumber } = req.body;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = crypto.pbkdf2Sync(user_pw, salt, 8754, 64, 'sha512').toString('hex');
        const newUser = await User.create({
            ...req.body,
            user_pw: hashedPassword,
            user_salt : salt
        });
        res.json({ message: '회원가입 성공' });
    } catch (error) {
        console.log('회원가입 실패: ', error.message);
        res.json({ message: '회원가입 실패' });
    }
};

exports.loginPostMid = async (req, res) => {
    const { user_email, user_pw } = req.body;
    let salt = req.salt;
    let hashedPassword = crypto.pbkdf2Sync(user_pw, salt, 8745, 64, 'sha512').toString('hex');
    const user = await User.findOne({
        attributes: ['user_email'],
        where: {
            user_email: user_email,
            user_pw: hashedPassword
        }
    });

    if (user) {
        res.json({ result: user_email });
    }
    else {
        console.log(user)
        res.json({ message: '아이디 또는 비밀번호를 잘못 입력' });
    }

};