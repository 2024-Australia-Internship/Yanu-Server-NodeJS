const { Sequelize, DataTypes } = require('sequelize');

class Farm extends Sequelize.Model {
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
        uniqe: true,
        reference: {
          model: 'users',
          key: 'id',
        }
      },
      business_name: {
        type: DataTypes.STRING(80),
      },
      farm_name: {
        type: DataTypes.STRING(50),
      },
      phonenumber: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(40),
      },
      address: {
        type: DataTypes.STRING(120),
      },
      farm_image: {
        type: DataTypes.STRING(100),
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Farm',
      tableName: 'Farms',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  }
}

module.exports = Farm;