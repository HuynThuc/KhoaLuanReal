// src/service/promotion.service.ts

import { AppDataSource } from '../database/db';
import { Promotion } from '../entities/promotion.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserPromotion } from '../entities/user_promotions.entity';
import { PromotionDTO } from '../dto/promotion.dto';
import { OrderDetail } from '../entities/order_detail.entity';
import { EmailService } from './email.service';
import { GymPackage } from '../entities/gymPackage.entity';

export class PromotionService {
    private gymPackageRepository: Repository<GymPackage>
    private promotionRepository: Repository<Promotion>;
    private userRepository: Repository<User>;
    private orderDetailRepository: Repository<OrderDetail>;
    private userPromotionRepository: Repository<UserPromotion>;
    private emailService: EmailService;

    constructor() {
        this.gymPackageRepository = AppDataSource.getRepository(GymPackage)
        this.promotionRepository = AppDataSource.getRepository(Promotion);
        this.userRepository = AppDataSource.getRepository(User);
        this.orderDetailRepository = AppDataSource.getRepository(OrderDetail);
        this.userPromotionRepository = AppDataSource.getRepository(UserPromotion);
        this.emailService = new EmailService();
    }


    //Tạo mã giảm giá
   // Tạo mã giảm giá liên kết với GymPackage
   async createPromotion(createPromotionDto: PromotionDTO): Promise<Promotion> {
    // Kiểm tra xem mã giảm giá đã tồn tại chưa
    const existingPromotion = await this.promotionRepository.findOneBy({ code: createPromotionDto.code });
    if (existingPromotion) {
        throw new Error('Mã giảm giá đã tồn tại');
    }

    // Kiểm tra xem gymPackage có tồn tại không
    const gymPackage = await this.gymPackageRepository.findOneBy({ id: createPromotionDto.gymPackageId });
    if (!gymPackage) {
        throw new Error('Gói tập không tồn tại');
    }

    // Tạo mã giảm giá và liên kết với GymPackage
    const promotion = this.promotionRepository.create({
        ...createPromotionDto,
        gymPackage: gymPackage // Gắn gymPackage vào promotion
    });

    return this.promotionRepository.save(promotion);
}

    // Liên kết mã giảm giá với người dùng và gửi email
    async assignSpecialPromotionToUser(userId: number, promotionId: number): Promise<UserPromotion> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error('User không tồn tại');
        
        const promotion = await this.promotionRepository.findOneBy({ id: promotionId });
        if (!promotion) throw new Error('Promotion không tồn tại');

        // Tạo bản ghi liên kết giữa người dùng và mã giảm giá
        const userPromotion = this.userPromotionRepository.create({
            user: user,
            promotion: promotion,
            isUsed: false // Đặt mặc định là chưa sử dụng
        });

        const savedUserPromotion = await this.userPromotionRepository.save(userPromotion);

        // Gửi email thông báo cho người dùng
        await this.emailService.sendPromotionEmail(user.email, promotion.code);

        return savedUserPromotion;
    }

    
    // Tạo mã giảm giá chào mừng cho user mới
    async createWelcomePromotion(userId: number): Promise<Promotion> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User không tồn tại');
        }

        // Tạo mã giảm giá unique cho user
        const welcomeCode = `WELCOME${userId}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
        
        // Tạo promotion mới
        const promotion = this.promotionRepository.create({
            name: 'Welcome Discount',
            description: 'Mã giảm giá chào mừng thành viên mới',
            code: welcomeCode,
            discountPercent: 20,
            type: 'welcome',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        const savedPromotion = await this.promotionRepository.save(promotion);

         // Tạo bản ghi UserPromotion liên kết người dùng với mã giảm giá
         const userPromotion = this.userPromotionRepository.create({
            user: user, // Liên kết đến người dùng
            promotion: savedPromotion, // Liên kết đến mã giảm giá vừa tạo
            isUsed: false // Mặc định là chưa sử dụng
        });

        await this.userPromotionRepository.save(userPromotion);
        return promotion;
    }


    // Kiểm tra và xác thực mã giảm giá
    async validatePromotion(userId: number, code: string, packageId: number): Promise<Promotion> {
        // Tìm promotion và join với userPromotions, user và gymPackage để kiểm tra
        const promotion = await this.promotionRepository.findOne({
            where: { code },
            relations: ['userPromotions', 'userPromotions.user', 'gymPackage']
        });
    
        if (!promotion) {
            throw new Error('Mã giảm giá không tồn tại');
        }
    
        // Kiểm tra thời hạn
        const currentDate = new Date().toISOString().split('T')[0];
        if (currentDate < promotion.startDate) {
            throw new Error('Mã giảm giá chưa có hiệu lực');
        }
        if (currentDate > promotion.endDate) {
            throw new Error('Mã giảm giá đã hết hạn');
        }
    
        // Kiểm tra xem mã giảm giá có liên kết với gói tập mà người dùng đã chọn
        if (!promotion.gymPackage || promotion.gymPackage.id !== packageId) {
            throw new Error('Mã giảm giá không áp dụng cho gói tập này');
        }
    
        // Kiểm tra type của promotion
        if (promotion.type === 'welcome' || promotion.type === 'special') {
            // Với mã welcome hoặc special, kiểm tra liên kết user
            const userPromotion = promotion.userPromotions.find(up => 
                up.user.id === userId && !up.isUsed
            );
    
            if (!userPromotion) {
                throw new Error('Mã giảm giá không thuộc về bạn hoặc đã được sử dụng');
            }
        } else if (promotion.type === 'public') {
            // Kiểm tra trong OrderDetail nếu mã `public` đã được áp dụng cho user này
            const usedOrder = await this.orderDetailRepository.findOne({
                where: {
                    promotion: { id: promotion.id },
                    order: { user: { id: userId } }
                }
            });
    
            if (usedOrder) {
                throw new Error('Bạn đã sử dụng mã giảm giá này');
            }
        }
    
        return promotion;
    }
    

      // Phương thức để lấy tất cả người dùng
      async getAllPromotion(): Promise<Promotion[]> {
        return await this.promotionRepository.find();
    }
}
