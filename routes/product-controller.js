const { Product } = require('../models');
const multer = require('multer');
const path = require('path');

exports.createInfoPostMid = async (req, res) => {
    const { product_title, product_category, product_hashtag, product_price, product_weight, product_unit, product_description } = req.body;
    const user_code = req.params.user_code;
    const product_code = req.code;

    try {
        const createProduct = await Product.create({
            user_code: user_code,
            product_code: product_code,
            ...req.body
        });
        res.status(201).json({ success: true, message: '제품 등록 성공' });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류로 제품 등록 실패' });
    }

}


exports.createImagePostMid = async (req, res) => {
    const user_code = req.params.user_code;
    const fileInfos = [];

    // 이미지 저장 디렉토리 설정
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'product_images/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "_product_" + user_code;
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage: storage });

    try {
        // 이미지 업로드
        upload.array('images', 5)(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: '이미지 업로드 중 오류 발생' });
            } else if (err) {
                return res.status(500).json({ success: false, message: '서버 오류로 이미지 업로드 실패' });
            }

            // 업로드된 이미지 정보 저장
            const files = req.files;
            files.forEach((file) => {
                fileInfos.push(file.filename);
            });

            // 클라이언트에게 응답
            res.status(201).json({ success: true, message: '이미지가 성공적으로 업로드 됨' });

            // 데이터베이스 업데이트
            try {
                const createProductImg = await Product.update(
                    { product_image: fileInfos.toString() },
                    { where: { user_code } }
                );
            } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: '이미지 db 저장 중 서버 에러 발생' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: '이미지 db 저장 중 에러 발생' });
    }
};
