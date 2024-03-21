const { Sequelize, DataTypes } = require('sequelize');

class Product_Img extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        references:{
          model : 'products',
          key : 'id'
        }
      },
      image: {
        type: DataTypes.STRING(80),
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Product_Img',
      tableName: 'products_img',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }
}


module.exports = Product_Img;