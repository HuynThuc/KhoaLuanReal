// src/services/trainerSchedule.service.ts
import { AppDataSource } from '../database/db';
import { Repository } from 'typeorm';
import { Trainer } from '../entities/trainer.entity';
import { TrainerSchedule } from '../entities/trainerSchedule.entity';
import { TrainerScheduleDTO } from '../dto/trainerSchedule.dto';

export class TrainerScheduleService {
    private trainerRepository: Repository<Trainer>;
    private trainerScheduleRepository: Repository<TrainerSchedule>;

    constructor() {
        this.trainerRepository = AppDataSource.getRepository(Trainer); 
        this.trainerScheduleRepository = AppDataSource.getRepository(TrainerSchedule); 
    }

    // Tạo lịch trình mới
    async createSchedule(scheduleData: TrainerScheduleDTO): Promise<TrainerSchedule> {
        const trainer = await this.trainerRepository.findOne({
            where: { id: scheduleData.trainerId },
        });
    
        if (!trainer) {
            throw new Error('Trainer not found');
        }

        // Tạo lịch trình mới với huấn luyện viên liên kết
        const newSchedule = this.trainerScheduleRepository.create({
            ...scheduleData,
            trainer, // Gán ID của huấn luyện viên
        });
        
        return await this.trainerScheduleRepository.save(newSchedule);
    }

    // Lấy tất cả lịch trình
    async getAllSchedules(): Promise<TrainerSchedule[]> {
        return await this.trainerScheduleRepository.find();
    }

     // Lấy lịch trình theo ID của huấn luyện viên
     async getSchedulesByTrainerId(trainerId: number): Promise<TrainerSchedule[]> {
        return await this.trainerScheduleRepository.find({
            where: { trainer: { id: trainerId } }, // Tìm kiếm theo ID huấn luyện viên
            relations: ['trainer'], // Đảm bảo load quan hệ với trainer
        });
    }
}
