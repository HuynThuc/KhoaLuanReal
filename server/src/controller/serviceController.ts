// src/controller/service.controller.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ServiceService } from '../services/service.service';
import { AppDataSource } from '../database/db';
import { Service } from '../entities/service.entity';
import { ServiceDTO } from '../dto/service.dto';
import { multerConfig } from '../config/multer.config';

const router = Router();
const serviceService = new ServiceService(AppDataSource.getRepository(Service));
const upload = multer(multerConfig);

// Lấy tất cả các gói dịch vụ
router.get('/getAllServices', async (req: Request, res: Response) => {
    try {
        const services = await serviceService.getAll();
        res.status(200).json(services);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Tạo gói dịch vụ mới
router.post('/addService', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const serviceData: ServiceDTO = req.body;
        const service = await serviceService.create(serviceData, req.file);
        res.status(201).json(service);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Lấy gói dịch vụ theo ID
router.get('/getService/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const service = await serviceService.getById(id);
        if (service) {
            res.status(200).json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Cập nhật gói dịch vụ
router.put('/updateService/:id', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const serviceData: ServiceDTO = req.body;
        const updatedService = await serviceService.update(id, serviceData, req.file);

        if (updatedService) {
            res.status(200).json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Xóa gói dịch vụ
router.delete('/deleteService/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await serviceService.delete(id);

        if (deleted) {
            res.status(200).json({ message: 'Service deleted successfully' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;
