const { Sequelize, DataTypes } = require('sequelize');

class Purchaes extends Sequelize.Model {
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
            },
            payment_method: {
                type: DataTypes.STRING(50)
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Purchaes',
            tableName: 'Purchaes_Historys',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
}

module.exports = Purchaes;