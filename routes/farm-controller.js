const multer = require('multer');
const path = require('path')
const { Farm, User } = require('../models');

exports.registerPostMid = async (req, res) => {
    try {
        const user_code = req.body.user_code;
        const farm_code = req.code;
        const user = await User.findOne({ where: { user_code } });
        const registerFarm = await Farm.create({
            farm_code,
            ...req.body
        });

        if (registerFarm) {
            await user.update({ is_farmer: true });
            res.status(201).json({ success: true, message: '농장 등록 성공', farm_code });
        } else {
            res.status(400).json({ success: false, message: '농장 등록 중 오류 발생' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '농장 등록 중 서버 오류 발생' });
    }
}

exports.registerImagePostMid = async (req, res) => {
    const user_code = req.params.user_code;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'farm_images/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "_farm_" + user_code;
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage }).single('farm_image');

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer Error:", err);
            return res.status(500).json({ success: false, message: '이미지 업로드 실패' });
        } else if (err) {
            console.log("Error:", err);
            return res.status(500).json({ success: false, message: '서버 오류 발생' });
        }

        const image_url = req.file ? req.file.filename : null;

        const register_img_url = await Farm.update(
            { farm_image: image_url },
            { where: { user_code } }
        );

        if (register_img_url) {
            res.status(200).json({ success: true, message: '농장 이미지 성공적으로 업로드 됨' });
        } else {
            res.status(500).json({ success: false, message: '농장 이미지 업로드 실패' });
        }
    })
}