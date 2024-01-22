const Sequelize = require('sequelize');
const User = require('./user');
const Product = require('./product');
const Farm = require('./farm');
const Heart = require('./heart');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.User = User;
db.Product = Product;
db.Farm = Farm;
db.Heart = Heart;

User.init(sequelize);
Product.init(sequelize);
Farm.init(sequelize);
Heart.init(sequelize);

module.exports = db;