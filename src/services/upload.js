const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync('uploads', { recursive: true })
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        let fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const fn = file.fieldname + '-' + Date.now() + fileExtension
        cb(null, fn)
        req.body.fileNames = req.body.fileNames && req.body.fileNames.length ? [...req.body.fileNames, fn] : [fn]
    }
});

const upload = multer({ storage: storage });

module.exports = upload;