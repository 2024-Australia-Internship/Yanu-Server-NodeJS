const crypto = require('crypto');

const generateHashedPassword  = async (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 8754, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve(derivedKey.toString('hex'));
            }
        });
    });
};

module.exports = {generateHashedPassword };