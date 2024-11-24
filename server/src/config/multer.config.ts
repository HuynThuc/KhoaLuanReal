// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../cilent/public/images');  // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Đặt tên file với timestamp
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
};