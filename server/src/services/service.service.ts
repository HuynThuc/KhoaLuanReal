import { AppDataSource } from '../database/db'; // Import AppDataSource thay vì getRepository
import { Service } from '../entities/service.entity'; // Đổi GymPackage thành Service
import { ServiceDTO } from '../dto/service.dto'; // Đổi GymPackageDTO thành ServiceDTO
import { Repository } from 'typeorm';

export class ServiceService {
    private serviceRepository = AppDataSource.getRepository(Service); // Đổi GymPackage thành Service

    constructor(serviceRepository: Repository<Service>) { // Đổi GymPackage thành Service
        this.serviceRepository = serviceRepository; // Gán repository vào biến instance
    }

    // Lấy tất cả gói dịch vụ
    async getAll(): Promise<Service[]> {
        return await this.serviceRepository.find();
    }

    // Lấy gói dịch vụ theo ID
    async getById(id: number): Promise<Service | null> {
        return await this.serviceRepository.findOne({ where: { id } });
    }

    // Tạo mới gói dịch vụ
    async create(serviceData: ServiceDTO, imageFile?: Express.Multer.File): Promise<Service> {
        const service = this.serviceRepository.create({
            ...serviceData,
            image: imageFile ? imageFile.filename : undefined
        });
        return await this.serviceRepository.save(service);
    }

    // Cập nhật gói dịch vụ theo ID
    async update(id: number, serviceData: ServiceDTO, imageFile?: Express.Multer.File): Promise<Service | null> {
        const service = await this.serviceRepository.findOne({ where: { id } });

        if (!service) {
            return null; // Trả về null nếu không tìm thấy gói dịch vụ
        }

        // Cập nhật thông tin gói dịch vụ
        this.serviceRepository.merge(service, {
            ...serviceData,
            image: imageFile ? imageFile.filename : service.image // Giữ ảnh cũ nếu không có ảnh mới
        });

        return await this.serviceRepository.save(service);
    }

    // Xóa gói dịch vụ theo ID
    async delete(id: number): Promise<boolean> {
        const result = await this.serviceRepository.delete(id);

        // Kiểm tra xem xóa thành công hay không
        return result.affected !== 0;
    }


}
