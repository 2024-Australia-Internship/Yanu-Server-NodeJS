const { Product, Farm, User } = require('../models');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');


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
        res.status(201).json({ success: true, message: '제품 등록 성공', product_code: product_code });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류로 제품 등록 실패' });
    }

}

exports.createImagePostMid = async (req, res) => {
    const user_code = req.params.user_code;
    const product_code = req.params.product_code;
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
                    { where: { user_code, product_code } }
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

exports.listGetMid = async (req, res) => {
    try {
        const products = await Product.findAll({});
        const farm_name = await Farm.findAll({attributes : ['business_name']});
        // 각 제품의 0번째 이미지 파일명 가져오기
        const firstProductImages = products.map(products => {
            return products.product_image ? products.product_image.split(',')[0] : null;
        });

        // 각 0번째 이미지 파일명에서 이미지 URL 생성
        const firstProductImageURL = firstProductImages.map(fileName => {
            return fileName ? `http://192.168.1.121:3000/product_images/${fileName}` : null;
        });

        if (products && products.length > 0) {
            res.status(200).json({ success: true, products, firstProductImageURL, farm_name });
        } else {
            res.status(404).json({ success: false, message: '조회된 제품이 없습니다.' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '데이터베이스에서 제품 목록을 불러오는 중 오류 발생' });
    }
}

exports.productcodeGetMid = async (req, res) => {
    const user_code = req.params.user_code;
    const product_code = req.params.product_code;
    let userInfo = [];
    try {
        const infoProduct = await Product.findOne({
            where: { product_code }
        });
        const { product_image } = infoProduct;
        const fileNames = product_image.split(",");
        const images = fileNames.map((fileName) => `http://192.168.1.121:3000/product_images/${fileName}`);

        const nickname = await User.findOne({
            where: { user_code },
            attributes: ['nickname']
        });
        userInfo.push(nickname.nickname);

        const businessName = await Farm.findOne({
            where: { user_code },
            attributes: ['business_name']
        })
        userInfo.push(businessName.business_name);

        if (infoProduct) {
            res.status(200).json({ success: true, infoProduct, images, userInfo });
        } else {
            res.status(404).json({ success: false, message: '해당 product_code를 가진 제품을 찾을 수 없음' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '서버 오류로 제품 불러오기 실패' })
    }
}

exports.usercodeGetMid = async (req, res) => {
    const user_code = req.params.user_code;

    try {
        const productList = await Product.findAll({
            where: { user_code },
        });

        // 각 제품의 0번째 이미지 파일명 가져오기
        const firstProductImages = productList.map(product => {
            return product.product_image ? product.product_image.split(',')[0] : null;
        });

        // 각 0번째 이미지 파일명에서 이미지 URL 생성
        const firstProductImageURL = firstProductImages.map(fileName => {
            return fileName ? `http://192.168.1.121:3000/product_images/${fileName}` : null;
        })

        if (productList.length > 0) {
            res.status(200).json({ success: true, productList, firstProductImageURL });
        } else {
            res.status(404).json({ success: false, message: '해당 유저 제품 없음' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '이미지 불러오는 중 서버 에러 발생' })
    }
}

exports.productSearchGetMid = async (req, res) => {
    const keyword = req.params.keyword;

    try {
        const searchProduct = await Product.findAll({
            where: {
                product_title: {
                    [Sequelize.Op.like]: `%${keyword}%`
                }
            }
        })
        console.log(searchProduct)
        if(searchProduct.length > 0){
            res.status(200).json({ success: true, searchProduct });
        } else {
            res.status(404).json({ success: true, message: '검색 결과 없음' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}

exports.productCategorySearchGetMid = async (req, res) => {
    const product_category = req.params.product_category==="vegetable" ? 0 : 1;
    const keyword = req.params.keyword;

    try {
        const searchProduct = await Product.findAll({
            where: {
                product_title: {
                    [Sequelize.Op.like]: `%${keyword}%`
                },
                product_category
            }
        })
        console.log(searchProduct)
        if(searchProduct.length > 0){
            res.status(200).json({ success: true, searchProduct });
        } else {
            res.status(404).json({ success: true, message: '검색 결과 없음' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}