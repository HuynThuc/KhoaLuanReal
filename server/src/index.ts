import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/db';
import authRoutes from './controller/authController';
import serviceRoutes from './controller/serviceController';
import gymPackageRoutes from './controller/gymPackageController';
import trainerRoutes from './controller/trainerController';
import orderRoutes from './controller/orderController';
import ScheduleRoutes from './controller/trainerScheduleController';
import PromotionRoutes from './controller/promotionController';
import MomoRoutes from './controller/momoController';
import ReviewRoutes from './controller/reviewController';
import passport from 'passport';
import session from 'express-session';
import './config/passport.config';

import multer from 'multer';
import { multerConfig } from './config/multer.config';

import { NotificationService } from './services/notification.service'; // Import service

const startServer = () => {
    const app = express();

    app.use(cors({
        origin: ['http://localhost:3000'], // Frontend URL
        credentials: true
    }));
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(express.json());

    // Khởi tạo Multer với cấu hình đã định nghĩa
    const upload = multer(multerConfig);

    // Đăng ký các route
    app.use('/auth', authRoutes);
    app.use('/service', serviceRoutes);
    app.use('/gymPackage', gymPackageRoutes);
    app.use('/trainer', trainerRoutes);
    app.use('/order', orderRoutes);
    app.use('/schedule', ScheduleRoutes);
    app.use('/promotion', PromotionRoutes);
    app.use('/payment', MomoRoutes);
    app.use('/review', ReviewRoutes);


    // Sử dụng multer cho tất cả các route trong gymPackageRoutes
    app.use('/service', upload.single('image'), serviceRoutes);
    app.use('/trainer', upload.single('image'), trainerRoutes);

    // Khởi tạo và khởi động NotificationService (để cron job bắt đầu chạy)
    const notificationService = new NotificationService(); // Đảm bảo khởi tạo service này

    app.listen(3002, () => {
        console.log("Ứng dụng đang chạy trên cổng 3002");
    });
};

(async () => {
    try {
        await initializeDatabase();
        startServer();
    } catch (error) {
        console.error("Không thể khởi động server:", error);
    }
})();
