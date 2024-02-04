const express = require('express');
const cors = require('cors');
const  morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

const { sequelize } = require('./models'); //sequlize 인스턴스 불러오기
const { swaggerUi, specs } = require("./swagger/swagger");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.set('port', process.env.PORT || 3000); //포트 설정

//시퀄라이즈와 데이터베이스 동기화
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  })

app.use(morgan('dev')); //http 요펑 로깅을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/product_images', express.static(path.join(__dirname, 'product_images')));
app.use('/farm_images', express.static(path.join(__dirname, 'farm_images')));


const users = require('./routes/user');
app.use('/users', users);

const products = require('./routes/product');
app.use('/products', products);

const farms = require('./routes/farm');
app.use('/farms', farms);

const hearts = require ('./routes/heart');
app.use('/hearts', hearts);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))


app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});