import { Router, Request, Response } from 'express';
import { GymPackageService } from '../services/gymPackage.service';
import { GymPackageDTO } from '../dto/gymPackage.dto';
import { GymPackage } from '../entities/gymPackage.entity';
import { AppDataSource } from '../database/db';


const router = Router();
const gymPackageService = new GymPackageService(AppDataSource.getRepository(GymPackage)); 

// Lấy tất cả gói tập
router.get('/getAllPackage', async (req: Request, res: Response) => {
    try {
        const gymPackage = await gymPackageService.getAll();
        res.status(200).json(gymPackage);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});




// Lấy gói tập theo ID
router.get('/getGymPackagesByService/:serviceId', async (req, res) => {
    const { serviceId } = req.params;
    try {
        const gymPackages = await gymPackageService.getByServiceId(Number(serviceId));
        res.json(gymPackages);
    } catch (error) {
     
    }
});



// Tạo gói tập mới
router.post('/addGymPackage', async (req: Request, res: Response) => {
    console.log('Request Body:', req.body);

    try {
        const gymPackageData: GymPackageDTO = req.body; // Trích xuất dữ liệu từ body
        const gymPackage = await gymPackageService.create(gymPackageData); // Gọi service để tạo gói dịch vụ
        res.status(201).json(gymPackage); // Trả về gói dịch vụ mới được tạo
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message }); // Trả về thông báo lỗi nếu có
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});


// Cập nhật gói tập theo ID
router.put('/updateGymPackage/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const gymPackageData: GymPackageDTO = req.body; // Lấy dữ liệu từ body của request
        const updatedGymPackage = await gymPackageService.update(Number(id), gymPackageData); // Gọi service để cập nhật gói tập
        res.status(200).json(updatedGymPackage); // Trả về gói tập đã cập nhật
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;