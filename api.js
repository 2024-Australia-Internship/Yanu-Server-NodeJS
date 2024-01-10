const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const users = require('./routes/user');
app.use('/users', users);


app.listen(port, ()=> {
    console.log(`Example app listeing on port ${port}`)
})