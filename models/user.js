const { Sequelize, DataTypes } = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING(45),
        unique: true,
      },
      user_pw: {
        type: DataTypes.BLOB,
      },
      user_salt: {
        type: DataTypes.BLOB,
      },
      user_phonenumber: {
        type: DataTypes.STRING(50),
      },
      profile_image: {
        type: DataTypes.STRING(100),
      },
      nickname: {
        type: DataTypes.STRING(50),
      },
      user_code: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      is_farmer: {
        type: DataTypes.BOOLEAN,
      }, 
    },{
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
  }
}

module.exports = User;