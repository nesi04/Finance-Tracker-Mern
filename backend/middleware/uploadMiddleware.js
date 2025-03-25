const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    console.log("Uploaded file type:", file.mimetype); // Debugging log

    if (allowedTypes.includes(file.mimetype)) {  // Corrected 'mimetype'
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg .png and .jpg allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
