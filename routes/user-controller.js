const { hasUncaughtExceptionCaptureCallback } = require('process');
const { User } = require('../models');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const exp = require('constants');

//회원가입
exports.registerPostMid = async (req, res) => {
    try {
        const { user_email, user_pw, user_phonenumber } = req.body;
        const user_code = req.code;
        console.log("user_code : " + user_code);
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
            user_salt: salt,
            user_code: user_code
        });
        res.status(201).json({ success: true, message: '회원가입 성공' });
    } catch (error) {
        console.log('회원가입 실패: ', error.message);
        res.status(404).json({ success: false, message: '서버 오류' });
    }
};

//로그인
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
            res.status(200).json({ success: true, result: user_email });
        } else {
            console.log("비밀번호가 일치하지 않음");
            res.status(404).json({ success: false, message: '비밀번호가 일치하지 않습니다' });
        }
    } catch (error) {
        console.log("로그인 실패: ", error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//올바른 이메일을 입력했는지?
exports.checkEmailPostMid = async (req, res) => {
    const { user_email } = req.body;
    try {
        const checkEmail = await User.findOne({
            attributes: ['user_email'],
            where: { user_email }
        });
        if (checkEmail) {
            res.status(409).json({ success: false, message: '중복된 이메일 입력' });
        } else {
            res.status(200).json({ success: true, message: '이메일 사용 가능' });
        }
    } catch (error) {
        console.log("email 중복: ", error.message);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//비밀번호 잃어버렸을 때
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

        const newPassword = await User.update(
            { user_pw: hashedPassword, user_salt: salt },
            { where: { user_email } }
        );
        console.log(newPassword)
        if (newPassword[0] === 1) {
            res.status(201).json({ success: true, message: '비밀번호 변경 성공' });
        } else {
            res.status(404).json({ success: false, message: '일치하는 이메일이 없습니다' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};

//프르필 이미지 업로드
exports.profilePostMid = async (req, res) => {
    //이미지 저장 디렉토리 설정
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "_profile_";
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage }).single('profile_image');

    //multer 업로드 함수 호출
    upload(req, res, async function (err) {
        console.log(req.body)

        if (err instanceof multer.MulterError) {
            console.log("Multer Error:", err);
            return res.status(500).json({ success: false, message: '이미지 업로드 실패' });
        } else if (err) {
            console.log("Error:", err);
            return res.status(500).json({ success: false, message: '서버 오류 발생' });
        }

        const image_url = req.file ? req.file.filename : null;
        res.status(200).json({ success: true, message: '프로필이 성공적으로 업로드되었습니다.', image_url });
    })
}

//닉네임과 코멘트 입력
exports.profileInfoPostMid = async (req, res) => {
}