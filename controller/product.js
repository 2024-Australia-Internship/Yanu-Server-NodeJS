const { copyFileSync } = require('fs');
const { Product, Farm, User } = require('../models');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');
const configureMulter = require('../utils/multer');


exports.infoPostMid = async (req, res) => {
    try {
        const createProduct = await Product.create({
            ...req.body
        });
        res.status(201).json({ success: true, message: '제품 등록 성공' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: '서버 오류로 제품 등록 실패' });
    }

}

exports.imagePostMid = async (req, res) => {
    const user_id = req.params.user_id;
    const id = req.params.product_id;

    const fileInfos = [];
    try {
        const upload = configureMulter('product_images/', '_product_');

        upload.array('images', 5)(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: '이미지 업로드 중 오류 발생' });
            } else if (err) {
                return res.status(500).json({ success: false, message: '서버 오류로 이미지 업로드 실패' });
            }
            const files = req.files;
            files.forEach((file) => {
                fileInfos.push(file.filename);
            });
            res.status(201).json({ success: true, message: '이미지가 성공적으로 업로드 됨' });

            try {
                const createProductImg = await Product.update(
                    { image: fileInfos.toString() },
                    { where: { id, user_id} }
                );
            } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: '이미지 db 저장 중 에러 발생' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: '이미지 db 저장 중 에러 발생' });
    }
}


exports.productGetMid = async (req, res) => {
    const farmName = [];
    try {
        const products = await Product.findAll({});
        // 각 제품의 0번째 이미지 파일명 가져오기
        const firstProductImages = products.map(products => {
            return products.product_image ? products.product_image.split(',')[0] : null;
        });

        // 각 0번째 이미지 파일명에서 이미지 URL 생성
        const firstProductImageURL = firstProductImages.map(fileName => {
            return fileName ? `http://192.168.1.121:3000/product_images/${fileName}` : null;
        });

        const userCodeList = products.map(products => {
            return products.user_code;
        })

        const farmNamePromises = userCodeList.map(userCode => {
            return Farm.findOne({ attributes: ['business_name'], where: { user_code: userCode } });
        });

        const resolvedFarmNames = await Promise.all(farmNamePromises);

        for (let i = 0; i < resolvedFarmNames.length; i++) {
            farmName.push(resolvedFarmNames[i].dataValues.business_name)
        }

        if (products && products.length > 0) {
            res.status(200).json({ success: true, products, firstProductImageURL, farmName });
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

exports.userGetMid = async (req, res) => {
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
        const firstProductImages = searchProduct.map(products => {
            return products.product_image.split(',')[0]
        })

        const firstProductImageURL = firstProductImages.map(fileName => {
            return fileName ? `http://192.168.1.121:3000/product_images/${fileName}` : null;
        });

        if (searchProduct.length > 0) {
            res.status(200).json({ success: true, searchProduct, firstProductImageURL });
        } else {
            res.status(404).json({ success: true, message: '검색 결과 없음' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}

exports.productCategorySearchGetMid = async (req, res) => {
    const product_category = req.params.product_category === "vegetable" ? 0 : 1;
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

        const firstProductImages = searchProduct.map(products => {
            return products.product_image.split(',')[0]
        })

        const firstProductImageURL = firstProductImages.map(fileName => {
            return fileName ? `http://192.168.1.121:3000/product_images/${fileName}` : null;
        });

        if (searchProduct.length > 0) {
            res.status(200).json({ success: true, searchProduct, firstProductImageURL });
        } else {
            res.status(404).json({ success: true, message: '검색 결과 없음' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false });
    }
}