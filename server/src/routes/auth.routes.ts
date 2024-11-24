// src/routes/auth.routes.ts
import { Router } from 'express';
import authController from '../controller/authController';

const router = Router();

// Đăng ký người dùng
router.post('/register', authController.register);

// Đăng nhập người dùng
router.post('/login', authController.login);

// Làm mới token
router.post('/refresh-token', authController.refreshToken);

router.get('/getAllUser', authController.getAllUsers)

export default router;
