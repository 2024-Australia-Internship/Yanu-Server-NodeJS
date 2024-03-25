const { hasUncaughtExceptionCaptureCallback } = require('process');
const { User, Farm } = require('../models');
const { generateHashedPassword } = require('../utils/hashedPasword');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { unwatchFile } = require('fs');
const { log } = require('console');

//회원가입
exports.registerPostMid = async (req, res) => {
    try {
        const { email, password, phonenumber } = req.body;
        const salt = crypto.randomBytes(128).toString('base64');
        const hashedPassword = await generateHashedPassword(password, salt);
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
            password_salt: salt,
            user_ugly: 0,
            is_farmer: false,
        });
        const user_id = newUser.dataValues.id;
        res.status(201).json({ success: true, user_id : user_id });
    } catch (error) {
        console.log('회원가입 실패: ', error.message);
        res.status(404).json({ success: false, message: '서버 오류' });
    }
};

//로그인
exports.loginPostMid = async (req, res) => {
    const { email, password } = req.body;
    const salt = req.salt;
    try {
        const hashedPassword = await generateHashedPassword(password, salt);
        const loginUser = await User.findOne({
            attributes: ['id', 'email'],
            where: {
                password: hashedPassword
            }
        });

        if (loginUser) {
            console.log("로그인 성공");
            req.session.user_id = loginUser.user_id;
            req.session.save((err) => {
                if (err) {
                    console.error('세션 저장 오류:', err);
                } else {
                    console.log('세션 저장 완료');
                }
            });
            res.status(200).json({ success: true, results: { user_id: loginUser.id, user_email: email } });
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
    const { email } = req.body;
    try {
        const checkEmail = await User.findOne({
            attributes: ['email'],
            where: { email }
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
        const hashedPassword = await generateHashedPassword(new_password, salt);
        const newPassword = await User.update(
            { user_pw: hashedPassword, user_salt: salt },
            { where: { user_email } }
        );
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
            cb(null, 'profiles/');
        },
        filename: function (req, file, cb) {
            const profileDir = Date.now() + file.originalname;
            cb(null, profileDir);
        }
    });
    const upload = multer({ storage: storage }).single('profile_image');

    //multer 업로드 함수 호출
    upload(req, res, async function (err) {
        const user_id = req.body.user_id;
        if (err instanceof multer.MulterError) {
            console.log("Multer Error:", err);
            return res.status(500).json({ success: false, message: '이미지 업로드 실패' });
        } else if (err) {
            console.log("Error:", err);
            return res.status(500).json({ success: false, message: '서버 오류 발생' });
        }

        const image_url = req.file ? req.file.filename : null;

        const register_img_url = await User.update(
            { profile_image: image_url },
            { where: { id : user_id } }
        );

        if (register_img_url) {
            res.status(200).json({ success: true, message: '프로필이미지 성공적으로 업로드 됨' });
        } else {
            res.status(500).json({ success: false, message: '프로필이미지 업로드 실패' });
        }
    })
}

//닉네임과 코멘트 입력
exports.profileInfoPostMid = async (req, res) => {
    const { user_id, nickname, introduction } = req.body;
    const register_img_url = await User.update(
        { nickname: nickname, introduction: introduction },
        { where: { id : user_id } }
    );

    if (register_img_url) {
        res.status(200).json({ success: true, message: '프로필이 성공적으로 업로드 됨' });
    } else {
        res.status(500).json({ success: true, message: '프로필 업로드 실패' });
    }
}

//user_id로 모든 정보 불러오기
exports.usercodeGetMid = async (req, res) => {
    const user_id = req.params.user_id;
    //필요한 모든 정보 불러오기
    const userAllInfo = await User.findAll({
        attributes: ['email', 'phonenumber', 'profile_image', 'nickname', 'introduction', 'user_ugly', 'is_farmer'],
        where: { id: user_id },
    });

    const profile_image_name = userAllInfo[0].dataValues.profile_image;
    const profile_image = `http://192.168.1.121:3000/uploads/${profile_image_name}`;

    //농부일때 필요한 정보 더 불러오기
    if (userAllInfo[0].dataValues.is_farmer) {
        const farmInfo = await Farm.findOne({
            attributes: ['business_name', 'farm_image'],
            where: { user_id }
        });

        const farm_image_name = farmInfo.dataValues.farm_image;
        const farm_image = `http://192.168.1.121:3000/farm_images/${farm_image_name}`;
        console.log(farm_image)

        res.status(200).json({ success: true, userAllInfo, profile_image, farm_image, farmInfo });
    } else if (userAllInfo) {
        res.status(200).json({ success: true, userAllInfo, profile_image });
    } else {
        res.status(404).json({ success: false, message: '해당 user_code를 가진 사용자를 찾을 수 없음' });
    }

}