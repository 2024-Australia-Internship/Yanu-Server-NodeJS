const { Heart, Product, Farm, User } = require('../models');

exports.heartPostMid = async (req, res) => {
    const code = req.params.code;
    const { user_code, product_category } = req.body; //category는 bool, 0은 product, 1은 farm

    try {
        const createHeart = await Heart.create({
            code,
            ...req.body
        });
        if (createHeart) {
            res.status(201).json({ success: true, message: '하트 등록 성공' });
        } else {
            res.status(400).json({ success: false, message: '하트 등록 중 오류 발생' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: '하트 등록 중 서버 오류 발생' });
    }
}

exports.heartDeleteMid = async (req, res) => {
    const product_code = req.params.product_code;
    const user_code = req.body.user_code;

    try {
        const deleteHeart = await Heart.destroy({
            where: {
                product_code: product_code,
                user_code: user_code
            }
        });
        if (deleteHeart) {
            res.status(201).json({ success: true, message: '하트 삭제 성공' });
        } else {
            res.status(400).json({ success: false, message: '하트 삭제 중 오류 발생' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: false, message: '하트 삭제 중 서버 에러 발생' })
    }
}

exports.heartProductGetMid = async (req, res) => {
    const user_code = req.params.user_code;
    try {
        const heartList = await Heart.findAll({
            where: {
                user_code,
                product_category: 0
            }
        })

        const codeValues = heartList.map(heartList => heartList.code);

        // 각 하트에 대한 제품 정보를 가져오는 배열을 생성
        const productListPromise = codeValues.map(async code => {
            const findResult = await Product.findAll({ where: { user_code: code } });

            const productDataValues = findResult.map(findResult => findResult.dataValues);
            return {
                product: productDataValues
            };
        });

        // Promise 배열을 모두 기다려 결과를 얻음
        const productList = await Promise.all(productListPromise);

        if (productListPromise.length > 0) {
            res.status(200).json({ success: true, productList });
        } else if (productList.length === 0) {
            res.status(404).json({ success: true, message: '해당 유저의 찜 내역이 없음' })
        } else {
            res.status(400).json({ success: false, message: '하트 내역 불러오는 중 에러 발생' })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: '하트 리스트 불러오는 중 서버 에러 발생' });
    }
} 

exports.heartFarmGetMid = async (req, res) => {
    const user_code = req.params.user_code;

    try{
        const heartList = await Heart.findAll({
            where: {
                user_code,
                product_category : 1
            }
        })
        const codeValues = heartList.map(heartList => heartList.code);

        const farmListPromise = codeValues.map(async code => {
            const farmResult = await Farm.findAll ({where : {farm_code: code}});

            const farmDataValues = farmResult.map(farmResult => farmResult.dataValues);
            return{
                farm: farmDataValues
            };
        });

        const farmList = await Promise.all(farmListPromise);

        if(farmList.length > 0){
            res.status(200).json({success : true, farmList});
        } else if (farmList.length === 0){
            res.status(404).json({success : true, message: '해당 유저의 찜 내역이 없음'});
        } else {
            res.status(400).json({success: false, message: '하트 내역 불러오는 중 에러 발생'});
        }
    } catch(error){
        res.status(500).json({success : false, message: '하트 리스트 불러오는 중 서버 에러 발생'});
    }
}