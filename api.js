const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

db.getConnection((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Database connected successfully');
    }
});


app.listen(port, ()=> {
    console.log(`Example app listeing on port ${port}`)
})