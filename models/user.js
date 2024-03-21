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
      email: {
        type: DataTypes.STRING(45),
        unique: true,
      },
      password: {
        type: DataTypes.BLOB,
      },
      password_salt: {
        type: DataTypes.BLOB,
      },
      phonenumber: {
        type: DataTypes.STRING(50),
      },
      profile_image: {
        type: DataTypes.STRING(100),
      },
      nickname: {
        type: DataTypes.STRING(50),
      },
      introduction: {
        type: DataTypes.TEXT,
      },
      user_ugly: {
        type: DataTypes.INTEGER,
      },
      is_farmer: {
        type: DataTypes.BOOLEAN,
      }
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