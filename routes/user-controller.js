const { resolve } = require('path');
const { User } = require('../models');
const crypto = require('crypto');
const { rejects } = require('assert');
const { log } = require('console');

exports.registerPostMid = async (req, res) => {
    try {
        const { user_email, user_pw, user_phonenumber } = req.body;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = await new Promise((resolve, rejects)=> {
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
        res.json({ message: '회원가입 성공' });
    } catch (error) {
        console.log('회원가입 실패: ', error.message);
        res.json({ message: '회원가입 실패' });
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
            res.json({ result: user_email });
        } else {
            console.log("비밀번호가 일치하지 않음");
            res.json({ message: '비밀번호가 일치하지 않습니다' });
        }
    } catch (error) {
        console.log("로그인 실패: ", error);
        res.json({ message: '로그인 실패' });
    }
};