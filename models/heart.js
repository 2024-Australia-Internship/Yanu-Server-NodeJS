const { Sequelize, DataTypes } = require('sequelize');

class Heart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_code: {
                type: DataTypes.STRING(20),
                reference: {
                    model: 'user',
                    key: 'user_code',
                },
            },
            product_code: {
                type: DataTypes.STRING(20),
                reference: {
                    model: 'Product',
                    key: 'product_code'
                },
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Product',
            tableName: 'products',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
}

module.exports = Heart;