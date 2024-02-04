const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user');
const Heart = require('./heart')

class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(45),
      },
      product_image: {
        type: DataTypes.STRING(500),
      },
      product_title: {
        type: DataTypes.STRING(50),
      },
      product_category: {
        type: DataTypes.BOOLEAN,
      },
      product_hashtag: {
        type: DataTypes.STRING(150),
      },
      product_price: {
        type: DataTypes.STRING(20),
      },
      product_weight: {
        type: DataTypes.STRING(10),
      },
      product_unit: {
        type: DataTypes.STRING(20),
      },
      product_description: {
        type: DataTypes.TEXT,
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


module.exports = Product;