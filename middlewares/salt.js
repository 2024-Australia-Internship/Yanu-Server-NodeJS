/*const saltRequired = (req, res, next) => {
    const { user_id, user_pw } = req.body;
    db.query('SELECT user_salt FROM user where user_id = ?', [user_id], (err, result) => {
        if (result.length === 1) {
            const salt = result[0].user_salt.toString();
            req.salt = salt;
            next();
        } else {
            console.log(result.length);
            res.status(404).json({ message: '아이디가 일치하지 않음' });
        }
    })
};

module.exports = saltRequired;*/