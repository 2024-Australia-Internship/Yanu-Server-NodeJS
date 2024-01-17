const { hasUncaughtExceptionCaptureCallback } = require('process');
const { User } = require('../models');
const {generateHashedPassword } = require('../utils/hashedPasword');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

//회원가입
exports.registerPostMid = async (req, res) => {
    try {
        const { user_email, user_pw, user_phonenumber } = req.body;
        const user_code = req.code;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = await generateHashedPassword (user_pw, salt);
        const newUser = await User.create({
            ...req.body,
            user_pw: hashedPassword,
            user_salt: salt,
            user_code: user_code,
            is_farmer : false
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
        const hashedPassword = await generateHashedPassword (user_pw, salt);
        const loginUser = await User.findOne({
            attributes: ['user_email', 'user_code'],
            where: {
                user_pw: hashedPassword
            }
        });

        if (loginUser) {
            console.log("로그인 성공");
            req.session.user_code = loginUser.user_code;
            req.session.save((err) => {
                if (err) {
                    console.error('세션 저장 오류:', err);
                } else {
                    console.log('세션 저장 완료');
                }
            });
            res.status(200).json({ success: true, result: {user_email : user_email, user_code : loginUser.user_code} });
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
        const hashedPassword = await generateHashedPassword (new_password, salt);
        const newPassword = await User.update(
            { new_password: hashedPassword, user_salt: salt },
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
    const user_code = req.params.user_code;
    console.log(user_code)
    console.log("Received request for user_code:", user_code);
    //이미지 저장 디렉토리 설정
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "_profile_" + user_code;
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage }).single('profile_image');

    //multer 업로드 함수 호출
    upload(req, res, async function (err) {

        if (err instanceof multer.MulterError) {
            console.log("Multer Error:", err);
            return res.status(500).json({ success: false, message: '이미지 업로드 실패' });
        } else if (err) {
            console.log("Error:", err);
            return res.status(500).json({ success: false, message: '서버 오류 발생' });
        }

        const image_url = req.file ? req.file.filename : null;

        const register_img_url = await User.update(
            { profile_image : image_url},
            { where: { user_code } }
        );
        
        if(register_img_url) {
            res.status(200).json({ success: true, message: '프로필이미지 성공적으로 업로드 됨'});   
        } else {
            res.status(500).json({ success: false, message: '프로필이미지 업로드 실패' });   
        }
    })
}

//닉네임과 코멘트 입력
exports.profileInfoPostMid = async (req, res) => {
    const user_code = req.params.user_code;
    const {nickname, user_introduction} = req.body;
    const register_img_url = await User.update(
        { nickname: nickname, user_introduction: user_introduction },
        { where: { user_code } }
    );

    if(register_img_url) {
        res.status(200).json({ success: true, message: '프로필이 성공적으로 업로드 됨'});   
    } else {
        res.status(500).json({ success: true, message: '프로필 업로드 실패'}); 
    }
}