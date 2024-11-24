// src/controller/trainer.controller.ts
import { Router, Request, Response } from 'express';
import { TrainerService } from '../services/trainer.service'; // Import TrainerService
import { AppDataSource } from '../database/db';
import { Trainer } from '../entities/trainer.entity'; // Import Trainer entity
import { TrainerDTO} from '../dto/trainer.dto'; // Import DTOs
import { multerConfig } from '../config/multer.config';
import multer from 'multer';

const router = Router();
const trainerService = new TrainerService(AppDataSource.getRepository(Trainer));
const upload = multer(multerConfig);

// Lấy tất cả huấn luyện viên
router.get('/getAllTrainers', async (req: Request, res: Response) => {
    try {
        const trainers = await trainerService.getAll(); // Gọi service để lấy tất cả huấn luyện viên
        res.status(200).json(trainers); // Trả về danh sách huấn luyện viên
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Tạo huấn luyện viên mới
router.post('/addTrainer',upload.single('image'), async (req: Request, res: Response) => {
    try {
        const trainerData: TrainerDTO = req.body; // Trích xuất dữ liệu từ body
        const trainer = await trainerService.create(trainerData, req.file); // Gọi service để tạo huấn luyện viên
        res.status(201).json(trainer); // Trả về huấn luyện viên mới được tạo
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Lấy huấn luyện viên theo ID
router.get('/getTrainer/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const trainer = await trainerService.getById(id); // Gọi service để lấy huấn luyện viên theo ID
        if (trainer) {
            res.status(200).json(trainer); // Trả về thông tin huấn luyện viên
        } else {
            res.status(404).json({ message: 'Trainer not found' }); // Nếu không tìm thấy huấn luyện viên
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Lấy gói tập theo ID
router.get('/getTrainerByService/:serviceId', async (req, res) => {
    const { serviceId } = req.params;
    try {
        const trainers = await trainerService.getByServiceId(Number(serviceId));
        res.json(trainers);
    } catch (error) {
     
    }
});


// Xóa huấn luyện viên theo ID
router.delete('/deleteTrainer/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await trainerService.delete(id); // Gọi service để xóa huấn luyện viên
        res.status(204).send(); // Trả về mã trạng thái 204 No Content
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;
