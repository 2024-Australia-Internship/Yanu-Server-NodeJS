const { Sequelize, DataTypes } = require('sequelize');

class Cart extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                }
            },
            product_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'products',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Cart',
            tableName: 'carts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
}

module.exports = Cart;