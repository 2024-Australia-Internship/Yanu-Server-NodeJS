const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user');
const Product = require('./product');

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
                    model: User,
                    key: 'user_code',
                },
            },
            product_code: {
                type: DataTypes.STRING(20),
                reference: {
                    model: Product,
                    key: 'product_code'
                },
            },
            product_category: {
                type: DataTypes.BOOLEAN
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Heart',
            tableName: 'hearts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
}

module.exports = Heart;