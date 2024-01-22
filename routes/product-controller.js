const { Product } = require('../models');
const multer = require('multer');
const path = require('path');

exports.createInfoPostMid = async (req, res) => {
    const user_code = req.params.user_code;
    const product_code = req.code;
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
        upload.array('images', 5)(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: '이미지 업로드 중 서버 오류 발생' });
            } else {
                return res.status(500).json({ success: false, message: '서버 오류로 이미지 업로드 실패' });
            }

            const files = req.files;
            files.forEach((file) => {
                fileInfos.push(file.filename);
            });

            const createProduct = await Product.create({
                user_code: user_code,
                product_code: product_code,
                product_image: file,
                ...req.body
            });

        })


        res.status(201).json({ success: true, message: '제품 등록 성공' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '서버 오류로 제품 등록 실패' });
    }

}

exports.listGetMid = async (req, res) => {
    try {
        const products = await Product.findAll({});
        if (products && products.length > 0) {
            res.status(200).json({ success: true, products });
        } else {
            res.status(404).json({ success: false, message: '조회된 제품이 없습니다.' });
        }
    } catch (error) {
        console.log("Addfaf")
        res.status(500).json({ success: false, message: '데이터베이스에서 제품 목록을 불러오는 중 오류 발생' });
    }
}

exports.productcodeGetMid = async (req, res) => {
    const product_code = req.params.product_code;
    try {
        const infoProduct = await Product.findOne({
            where: { product_code }
        });
        const { product_image } = infoProduct;
        const fileNames = product_image.split(",");
        const images = fileNames.map((fileName) => `http://localhost:3000/product_images/${fileName}`);

        if (infoProduct) {
            res.status(200).json({ success: true, infoProduct, images });
        } else {
            res.status(404).json({ success: false, message: '해당 product_code를 가진 제품을 찾을 수 없음' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류로 제품 불러오기 실패' })
    }
}
