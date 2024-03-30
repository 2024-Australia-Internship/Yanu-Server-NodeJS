const { Sequelize, DataTypes } = require('sequelize');

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
        type: DataTypes.INTEGER,
        references:{
          model : 'users',
          key : 'id'
        }
      },
      title: {
        type: DataTypes.STRING(50),
      },
      category: {
        type: DataTypes.STRING(20),
      },
      hashtag: {
        type: DataTypes.STRING(200),
      },
      price: {
        type: DataTypes.STRING(20),
      },
      unit: {
        type: DataTypes.STRING(10),
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.STRING(200)
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