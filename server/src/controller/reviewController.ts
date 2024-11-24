// src/controller/review.controller.ts
import { Router, Request, Response } from 'express';
import { ReviewService } from '../services/review.service'; // Import ReviewService
import { AppDataSource } from '../database/db';
import { Review } from '../entities/review.entity'; // Import Review entity
import { ReviewDTO } from '../dto/review.dto'; // Import DTO
 // Import User entity, nếu cần

const router = Router();
const reviewService = new ReviewService(AppDataSource.getRepository(Review));

// Tạo mới một đánh giá
router.post('/reviews', async (req: Request, res: Response) => {
    try {
        // Trích xuất dữ liệu từ body
        const reviewData: ReviewDTO = req.body; 

        // Kiểm tra xem userId có trong body hay không. Nếu không có thì lấy từ JWT hoặc session.
        const userId = reviewData.userId // Lấy userId từ request (nếu đã được xác thực trong middleware)

        // Gọi service để tạo đánh giá
        const review = await reviewService.createReview(reviewData, userId); 
        res.status(201).json(review); // Trả về đánh giá mới tạo
    } catch (error: unknown) {
        // Xử lý lỗi
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});


router.get('/getReviews', async (req: Request, res: Response) => {
    try {
        const reviews = await reviewService.getAllReviews(); // Gọi service để lấy tất cả đánh giá
        res.status(200).json(reviews); // Trả về danh sách đánh giá
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;
