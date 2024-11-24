// src/modules/review/services/review.service.ts
import { AppDataSource } from '../database/db'; // Import AppDataSource thay vì getRepository
import { Review } from '../entities/review.entity'; // Import Review entity
import { ReviewDTO } from '../dto/review.dto'; // Import ReviewDTO
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // Liên kết với bảng User

export class ReviewService {
    private reviewRepository = AppDataSource.getRepository(Review); // Sử dụng Review repository

    constructor(reviewRepository: Repository<Review>) {
        this.reviewRepository = reviewRepository; // Gán repository vào biến instance
    }

    // Lấy tất cả đánh giá
    async getAllReviews(): Promise<Review[]> {
        return await this.reviewRepository.find({
            relations: ['user'], // Lấy cả thông tin người dùng
            order: {
                createdAt: 'DESC', // Sắp xếp theo ngày tạo, từ mới đến cũ
            },
        });
    }

    // Tạo mới một đánh giá
    async createReview(reviewData: ReviewDTO, userId: number): Promise<Review> {
        // Tìm người dùng từ userId
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found'); // Kiểm tra người dùng có tồn tại hay không
        }

        // Tạo và lưu đánh giá mới
        const review = this.reviewRepository.create({
            ...reviewData,
            user, // Liên kết với người dùng
        });

        return await this.reviewRepository.save(review);
    }
}
