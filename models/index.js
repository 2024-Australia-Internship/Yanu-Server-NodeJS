const Sequelize = require('sequelize');
const User = require('./user');
const Product = require('./product');
const Product_Img = require('./product_img');
const Favorite = require('./favorite');
const Farm = require('./farm');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Product = Product;
db.Product_Img = Product_Img;
db.Favorite = Favorite;
db.Farm = Farm;

User.init(sequelize);
Product.init(sequelize);
Product_Img.init(sequelize);
Favorite.init(sequelize);
Farm.init(sequelize);

db.User.hasOne(db.Farm, {foreignKey: 'user_id', sourceKey: 'id'});
db.Farm.belongsTo(db.User, {foreignKey: 'user_id', targetKey:'id'});


module.exports = db;