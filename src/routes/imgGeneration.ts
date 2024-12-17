import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as ImgGenerationController from '../controllers/ImgGenerationController'

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/upscale', upload.single('image'), ImgGenerationController.upscale)
router.post('/style', upload.single('image'),ImgGenerationController.style)

export default router