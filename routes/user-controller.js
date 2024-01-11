const db = require('../db/db');
const crypto = require('crypto');

exports.registerPostMid = (req, res) => {
    const {user_id, user_pw, user_phonenumber} = req.body;
    const salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2(user_pw, salt, 8745, 64, "sha512", (err, key) => {
        if(err){
            console.log("slat에서 에러 발생 : " + err);
            return;
        } else{
            db.query('INSERT INTO user (user_id, user_pw, user_salt, user_phonenumber) VALUES (?,?,?,?)', [user_id, key, salt, user_phonenumber], (err, result) => {
                if(err){
                    console.log("회원가입 실패 " + err.message);
                    return res.json({message : '회원가입 실패'});
                } else {
                    return res.json(result);
                }
            })
        }
    })
}



exports.loginPostMid = (req, res) => {
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
};