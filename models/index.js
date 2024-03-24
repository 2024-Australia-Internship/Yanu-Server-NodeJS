const Sequelize = require('sequelize');
const User = require('./user');
const Product = require('./product');
const Favorite = require('./favorite');
const Farm = require('./farm');
const Review = require('./reviews');
const Cart = require('./cart');
const Purchaes_History = require('./purchaes_history');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Product = Product;
db.Favorite = Favorite;
db.Farm = Farm;
db.Review = Review;
db.Cart = Cart;
db.Purchaes_History = Purchaes_History;

User.init(sequelize);
Product.init(sequelize);
Favorite.init(sequelize);
Farm.init(sequelize);
Review.init(sequelize);
Cart.init(sequelize);
Purchaes_History.init(sequelize);

db.User.hasOne(db.Farm, {foreignKey: 'user_id', sourceKey: 'id'});
db.Farm.belongsTo(db.User, {foreignKey: 'user_id', targetKey:'id'});


module.exports = db;