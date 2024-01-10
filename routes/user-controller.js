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
            db.query('INSERT INTO user (user_id, user_pw, user_salt, user_phonenumber) VALUES (?,?,?,?)', [user_id, user_pw, salt,user_phonenumber], (err, result) => {
                if(err){
                    console.log(err.message);
                    return res.json({message : '회원가입 실패'});
                } else {
                    return res.json(result);
                }
            })
        }
    })
}