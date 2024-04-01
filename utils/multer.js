const multer = require('multer');
const path = require('path');
const { sourceMapsEnabled } = require('process');

const configureMulter = (directory, prefix) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, directory);
        },
        filename: function (req, file, cb) {
            const user_id = req.params.user_id;
            const uniqueSuffix = Date.now() + prefix + user_id;
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    return multer({ storage: storage });
};

module.exports = configureMulter;