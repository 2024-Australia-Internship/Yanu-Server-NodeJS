const { hasUncaughtExceptionCaptureCallback } = require('process');
const { User } = require('../models');
const crypto = require('crypto');

exports.registerPostMid = async (req, res) => {
    try {
        const { user_email, user_pw, user_phonenumber } = req.body;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = await new Promise((resolve, rejects) => {
            crypto.pbkdf2(user_pw, salt, 8754, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(derivedKey.toString('hex'));
                }
            });
        });
        const newUser = await User.create({
            ...req.body,
            user_pw: hashedPassword,
            user_salt: salt
        });
        res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        console.log('회원가입 실패: ', error.message);
        res.status(404).json({ message: '서버 오류' });
    }
};

exports.loginPostMid = async (req, res) => {
    const { user_email, user_pw } = req.body;
    const salt = req.salt;
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(user_pw, salt, 8754, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(derivedKey.toString('hex'));
                }
            });
        });

        const loginUser = await User.findOne({
            attributes: ['user_email'],
            where: {
                user_pw: hashedPassword
            }
        });

        if (loginUser) {
            console.log("로그인 성공")
            res.status(200).json({ result: user_email });
        } else {
            console.log("비밀번호가 일치하지 않음");
            res.status(404).json({ message: '비밀번호가 일치하지 않습니다' });
        }
    } catch (error) {
        console.log("로그인 실패: ", error);
        res.status(500).json({ message: '서버 오류' });
    }
};

exports.checkEmailPostMid = async (req, res) => {
    const { user_email } = req.body;
    try {
        const checkEmail = await User.findOne({
            attributes: ['user_email'],
            where: { user_email }
        });
        if (checkEmail) {
            res.status(409).json({ message: '중복된 이메일 입력' });
        } else {
            res.status(200).json({ message: '이메일 사용 가능' });
        }
    } catch (error) {
        console.log("email 중복: ", error);
        res.status(500).json({ message: '서버 오류' })
    }
};

exports.forgetPasswordPatchMid = async (req, res) => {
    const { user_email, new_password } = req.body;
    try {
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = await new Promise((resolve, rejects) => {
            crypto.pbkdf2(new_password, salt, 8754, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(derivedKey.toString('hex'));
                }
            });
        });

        const newPassword  = await User.update(
            {user_pw: hashedPassword, user_salt: salt},
            {where: {user_email : user_email}}
        );

        if(newPassword[0] === 1) {
            res.status(201).json({message : '비밀번호 변경 성공'});
        } else {
            res.status(404).json({message : '일치하는 이메일이 없습니다'});
        }
    } catch(error){
        res.status(500).json({message : '서버 오류'});
    }
};