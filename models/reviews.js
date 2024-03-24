const { Sequelize, DataTypes, INTEGER } = require('sequelize');

class Review extends Sequelize.Model {
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
            image: {
                type: DataTypes.STRING(200)
            },
            description: {
                type: DataTypes.TEXT
            },
            starrating: {
                type: INTEGER
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
}

module.exports = Review;