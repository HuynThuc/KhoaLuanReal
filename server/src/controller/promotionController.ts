// src/controllers/promotion.controller.ts

import { Request, Response, Router } from 'express';
import { PromotionService } from '../services/promotion.service';
import { PromotionDTO } from '../dto/promotion.dto';

const promotionService = new PromotionService();
const router = Router();

// POST: Tạo mã giảm giá mới
router.post('/createPromotion', async (req: Request, res: Response) => {
    try {
        const promotionData: PromotionDTO = req.body;
        const newPromotion = await promotionService.createPromotion(promotionData);

        res.status(201).json({ message: 'Promotion created successfully', promotion: newPromotion });
    } catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ message: 'Error creating promotion' });
    }
});

// Lấy tất cả người dùng
router.get('/getAllPromotion', async (req: Request, res: Response) => {
    try {
        const promotion = await promotionService.getAllPromotion(); // Gọi phương thức getAllUsers từ instance
        res.json({
            Status: 'Success',
            promotion
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});


router.post('/validate/:userId', async (req: Request, res: Response) => {
    const userId = Number(req.params.userId); // Lấy userId từ params
    const code = req.body.code; // Lấy mã giảm giá từ body
    const gymPackageId = req.body.gymPackageId; // Lấy gymPackageId từ body

    try {
        // Gọi hàm validatePromotion với thêm gymPackageId
        const promotion = await promotionService.validatePromotion(userId, code, gymPackageId);

        if (promotion) {
            // Nếu mã giảm giá hợp lệ
            res.status(200).json({
                message: 'Mã giảm giá hợp lệ',
                promotion
            });
        } else {
            // Nếu mã giảm giá không hợp lệ
            res.status(400).json({
                message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.'
            });
        }
    } catch (error) {
        // Xử lý lỗi
        const errorMessage = (error as Error).message || 'Đã xảy ra lỗi không xác định.';
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình kiểm tra mã giảm giá.',
            error: errorMessage
        });
    }
});



// Gán mã giảm giá cho người dùng
router.post('/assign', async (req: Request, res: Response) => {
    const { userIds, promotionId } = req.body;

    try {
        const userPromotions = await Promise.all(
            userIds.map((userId: number) =>
                promotionService.assignSpecialPromotionToUser(userId, promotionId)
            )
        );
        res.status(201).json({ message: 'Promotion assigned successfully', userPromotions });
    } catch (error) {
        console.error('Error assigning promotion:', error);
        res.status(500).json({ message: 'Error assigning promotion' });
    }
});





// PUT: Cập nhật mã giảm giá theo ID


export default router;
