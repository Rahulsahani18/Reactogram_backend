const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Define a centralized uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // '..' to go one level up from the Routers directory

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Use the centralized uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'));
        }
    }
});

// Upload route
router.post('/uploadFile', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ fileName: req.file.filename });
});

// Download route
const downloadFile = (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, fileName); // Use the centralized uploads directory

    res.download(filePath, (error) => {
        if (error) {
            res.status(500).send({ message: 'File cannot be downloaded: ' + error });
        }
    });
};

router.get('/files/:filename', downloadFile);

module.exports = router;
