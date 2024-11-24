// src/services/order.service.ts
import { AppDataSource } from '../database/db';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order_detail.entity';
import { GymPackage } from '../entities/gymPackage.entity';
import { Trainer } from '../entities/trainer.entity';
import { EmailService } from './email.service';
import { User } from '../entities/user.entity';
import { Repository, Between } from 'typeorm';
import { OrderDTO, OrderDetailDTO, RevenueStatisticsDTO, MostSelectedTrainerDTO, MostPopularGymPackageDTO, QRCodeDTO } from '../dto/order.dto'; // Import DTO
import { Promotion } from '../entities/promotion.entity';
import { UserPromotion } from '../entities/user_promotions.entity';
import QRCode from 'qrcode';
import { startOfDay, endOfDay, startOfWeek, isWeekend, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'; // Dùng date-fns để tính khoảng thời gian


export class OrderService {
    private emailService: EmailService;
    private orderRepository: Repository<Order>;
    private orderDetailRepository: Repository<OrderDetail>;
    private gymPackageRepository: Repository<GymPackage>;
    private trainerRepository: Repository<Trainer>;
    private promotionRepository: Repository<Promotion>;

    constructor(
        orderRepository: Repository<Order> = AppDataSource.getRepository(Order),
        orderDetailRepository: Repository<OrderDetail> = AppDataSource.getRepository(OrderDetail),
        gymPackageRepository: Repository<GymPackage> = AppDataSource.getRepository(GymPackage),
        trainerRepository: Repository<Trainer> = AppDataSource.getRepository(Trainer),
        promotionRepository: Repository<Promotion> = AppDataSource.getRepository(Promotion),
    ) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.gymPackageRepository = gymPackageRepository;
        this.trainerRepository = trainerRepository;
        this.promotionRepository = promotionRepository;
        this.emailService = new EmailService();
    }

    // Hàm lấy tất cả các đơn hàng
    async getAllOrders(): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            relations: ['user', 'orderDetails', 'orderDetails.trainer', 'orderDetails.gymPackage', 'orderDetails.promotion'], // Thêm các mối quan hệ cần thiết
        });

        if (!orders || orders.length === 0) {
            throw new Error('No orders found');
        }

        return orders;
    }

    // Thêm phương thức mới để lấy ra order_detail theo trainerId
    async getOrderDetailsByTrainerId(trainerId: number): Promise<OrderDetail[]> {
        // Kiểm tra sự tồn tại của trainerId và trả về các order details liên quan
        const orderDetails = await this.orderDetailRepository.find({
            where: { trainer: { id: trainerId } },
            // relations: ['order', 'gymPackage', 'trainer']
        });

        if (!orderDetails || orderDetails.length === 0) {
            throw new Error('No order details found for the specified trainer ID');
        }

        return orderDetails;
    }

    // Tạo mới order và order details
    async createOrder(orderData: OrderDTO, orderDetailsData: OrderDetailDTO[]): Promise<Order> {
        const { userId, totalAmount, status } = orderData;

        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

        if (!user || !user.email) {
            throw new Error('User email not found');
        }

        const order = this.orderRepository.create({ user: { id: userId }, totalAmount, status });
        const savedOrder = await this.orderRepository.save(order);

        if (!Array.isArray(orderDetailsData) || orderDetailsData.length === 0) {
            throw new Error('Order details data must be a non-empty array');
        }

        const qrCodes: QRCodeDTO[] = [];
        const sessionInfo: { date: Date; timeSlots: string[] }[] = [];

        await Promise.all(orderDetailsData.map(async (detail) => {
            const gymPackage = await this.gymPackageRepository.findOne({ where: { id: detail.gymPackageId } });
            const trainer = await this.trainerRepository.findOne({ where: { id: detail.trainerId } });
            const promotion = detail.promotionId
                ? await this.promotionRepository.findOne({ where: { id: detail.promotionId } })
                : null;

            if (!gymPackage || !trainer) {
                throw new Error('Gym package or trainer not found');
            }

            const timeSlots = detail.sessionTime.split(',').map(time => time.trim());

            const orderDetailPromises = timeSlots.map(async (timeSlot) => {
                const orderDetail = this.orderDetailRepository.create({
                    order: savedOrder,
                    gymPackage,
                    trainer,
                    price: detail.price,
                    sessionDate: new Date(detail.sessionDate),
                    sessionTime: timeSlot,
                    promotion: promotion || undefined,
                    status: detail.status || 'pending' // Thêm status từ OrderDetailDTO hoặc sử dụng mặc định
                });

                await this.orderDetailRepository.save(orderDetail);
            });


            await Promise.all(orderDetailPromises);

            sessionInfo.push({ date: new Date(detail.sessionDate), timeSlots });

            if (promotion) {
                const userPromotion = await AppDataSource.getRepository(UserPromotion).findOne({
                    where: {
                        user: { id: userId },
                        promotion: { id: promotion.id }
                    }
                });

                if (userPromotion) {
                    userPromotion.isUsed = true;
                    await AppDataSource.getRepository(UserPromotion).save(userPromotion);
                }
            }
        }));

        // Tạo mã QR cho tất cả thông tin phiên
        const qrData = sessionInfo.map(info =>
            `Order ID: ${savedOrder.id}, Date: ${info.date.toISOString().split('T')[0]}, Times: ${info.timeSlots.join(', ')}`
        ).join('\n');

        const qrCode = await QRCode.toDataURL(qrData);
        qrCodes.push({
            orderId: savedOrder.id,
            date: new Date(), // Bạn có thể thay đổi giá trị này nếu cần
            time: 'Multiple Times', // Có thể điều chỉnh để hiển thị
            qrCode
        });

        console.log('Order', qrCodes)

        const completedOrder = await this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['orderDetails', 'orderDetails.trainer', 'orderDetails.gymPackage', 'orderDetails.promotion']
        });

        if (!completedOrder) {
            throw new Error('Failed to retrieve completed order');
        }

        try {
            await this.emailService.sendOrderConfirmation(completedOrder, user.email, qrCodes);
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }

        return completedOrder;
    }

    

    //Thống kê
    async getRevenueStatistics(
        startDate?: Date,
        endDate?: Date,
        period: 'daily' | 'monthly' = 'monthly'
    ): Promise<{
        statistics: RevenueStatisticsDTO[],
        totalRevenue: number,
        mostSelectedTrainer: MostSelectedTrainerDTO,
        mostPopularGymPackage: MostPopularGymPackageDTO,
        trainerPercentage: { id: number, name: string, percentage: number }[],
        gymPackagePercentage: { id: number, name: string, percentage: number }[]
    }> {
        let orderDetails;

        // Lấy orderDetails theo period
        if (period === 'monthly') {
            orderDetails = await this.orderDetailRepository.find({
                relations: ['order', 'trainer', 'gymPackage'],
            });
        } else {
            const start = startDate ? startOfDay(startDate) : startOfDay(new Date(0));
            const end = endDate ? endOfDay(endDate) : endOfDay(new Date());
            orderDetails = await this.orderDetailRepository.find({
                relations: ['order', 'trainer', 'gymPackage'],
                where: {
                    order: {
                        createdAt: Between(start, end),
                    },
                },
            });
        }

        const revenueStatistics: RevenueStatisticsDTO[] = [];
        let totalRevenue = 0;

        const trainerCountMap = new Map<number, { id: number, name: string, count: number }>();
        const gymPackageCountMap = new Map<number, { id: number, name: string, count: number }>();

        // Map để theo dõi các order đã được tính doanh thu
        const processedOrders = new Map<number, boolean>();

        for (const orderDetail of orderDetails) {
            let statisticDate: string;
            const orderId = orderDetail.order.id;
            const price = parseFloat(orderDetail.price as any);

            if (isNaN(price) || price < 0) {
                console.error('Giá trị price không hợp lệ:', orderDetail.price);
                continue;
            }

            switch (period) {
                case 'daily':
                    statisticDate = format(orderDetail.order.createdAt, 'yyyy-MM-dd');
                    break;
                case 'monthly':
                    statisticDate = format(orderDetail.order.createdAt, 'yyyy-MM');
                    break;
                default:
                    throw new Error('Invalid period type');
            }

            // Chỉ cộng doanh thu nếu order chưa được tính
            if (!processedOrders.has(orderId)) {
                const existingStatistic = revenueStatistics.find(stat => stat.date === statisticDate);

                if (existingStatistic) {
                    existingStatistic.revenue += price;
                } else {
                    revenueStatistics.push({
                        date: statisticDate,
                        revenue: price,
                        totalRevenue: price
                    });
                }
                totalRevenue += price;
                processedOrders.set(orderId, true); // Đánh dấu order đã được xử lý
            }

            // Đếm trainer
            if (orderDetail.trainer) {
                const trainer = trainerCountMap.get(orderDetail.trainer.id) || { id: orderDetail.trainer.id, name: orderDetail.trainer.trainerName, count: 0 };
                trainer.count += 1;
                trainerCountMap.set(orderDetail.trainer.id, trainer);
            }

            // Đếm gymPackage
            if (orderDetail.gymPackage) {
                const gymPackage = gymPackageCountMap.get(orderDetail.gymPackage.id) || { id: orderDetail.gymPackage.id, name: orderDetail.gymPackage.name, count: 0 };
                gymPackage.count += 1;
                gymPackageCountMap.set(orderDetail.gymPackage.id, gymPackage);
            }
        }

        revenueStatistics.forEach(stat => {
            stat.totalRevenue = totalRevenue;
        });

        // Tính toán phần trăm cho trainers
        const totalTrainerSelections = Array.from(trainerCountMap.values()).reduce((sum, trainer) => sum + trainer.count, 0);
        const trainerPercentage = Array.from(trainerCountMap.values()).map(trainer => ({
            id: trainer.id,
            name: trainer.name,
            percentage: (trainer.count / totalTrainerSelections) * 100
        }));

        // Tính toán phần trăm cho gym packages
        const totalGymPackageSelections = Array.from(gymPackageCountMap.values()).reduce((sum, gymPackage) => sum + gymPackage.count, 0);
        const gymPackagePercentage = Array.from(gymPackageCountMap.values()).map(gymPackage => ({
            id: gymPackage.id,
            name: gymPackage.name,
            percentage: (gymPackage.count / totalGymPackageSelections) * 100
        }));

        // Tìm HLV được chọn nhiều nhất
        const mostSelectedTrainer = Array.from(trainerCountMap.values()).reduce((prev, current) => current.count > prev.count ? current : prev);

        // Tìm gói tập phổ biến nhất
        const mostPopularGymPackage = Array.from(gymPackageCountMap.values()).reduce((prev, current) => current.count > prev.count ? current : prev);

        return {
            statistics: revenueStatistics,
            totalRevenue,
            mostSelectedTrainer: {
                trainer: {
                    id: mostSelectedTrainer.id,
                    name: mostSelectedTrainer.name
                },
                selectionCount: mostSelectedTrainer.count
            },
            mostPopularGymPackage: {
                gymPackage: {
                    id: mostPopularGymPackage.id,
                    name: mostPopularGymPackage.name
                },
                salesCount: mostPopularGymPackage.count
            },
            trainerPercentage,
            gymPackagePercentage
        };
    }

    // Phương thức mới để lấy order_details dựa vào userId
    async getOrderDetailsByUserId(userId: number): Promise<OrderDetail[]> {
        // Kiểm tra sự tồn tại của userId và trả về các order details liên quan
        const orderDetails = await this.orderDetailRepository.find({
            where: {
                order: {
                    user: { id: userId }
                }
            },
            relations: ['order', 'gymPackage', 'trainer', 'promotion'] // Thêm các quan hệ cần thiết nếu cần
        });

        if (!orderDetails || orderDetails.length === 0) {
            throw new Error('No order details found for the specified user ID');
        }

        return orderDetails;
    }

    async checkQRCode(qrData: string): Promise<void> {
        // Tách dữ liệu từ mã QR
        const lines = qrData.split('\n');
        const currentDate = new Date();
    
        // Sử dụng toLocaleDateString để lấy ngày hiện tại ở định dạng YYYY-MM-DD
        const currentDateString = currentDate.toLocaleDateString('en-CA'); // 'en-CA' cho định dạng YYYY-MM-DD
        console.log(`Ngày hiện tại: ${currentDateString}`); // In ra ngày hiện tại
    
        for (const line of lines) {
            // Kiểm tra định dạng dòng dữ liệu QR
            const match = line.match(/Order ID: (\d+), Date: (\d{4}-\d{2}-\d{2}), Times: (.+)/);
            if (match) {
                const orderId = parseInt(match[1]);
                const orderDate = match[2]; // Ngày từ mã QR (YYYY-MM-DD)
                const times = match[3].split(', ').map(time => time.trim()); // Lấy danh sách thời gian
    
                // Kiểm tra nếu ngày từ QR không trùng với ngày hiện tại
                if (orderDate !== currentDateString) {
                    console.log(`Ngày ${orderDate} không trùng với ngày hiện tại ${currentDateString}. Bỏ qua.`);
                    continue;
                }
    
                // Tìm đơn hàng theo ID
                const order = await this.orderRepository.findOne({
                    where: { id: orderId },
                    relations: ['user']
                });
    
                if (!order) {
                    console.error(`Không tìm thấy đơn hàng với ID ${orderId}`);
                    continue;
                }
    
                // Lấy danh sách chi tiết đơn hàng theo ID
                const orderDetails = await this.orderDetailRepository.find({
                    where: { order: { id: orderId } },
                    relations: ['trainer', 'gymPackage']
                });
    
                if (!orderDetails.length) {
                    console.error(`Không tìm thấy chi tiết đơn hàng cho đơn hàng ID ${orderId}`);
                    continue;
                }
    
                // Duyệt qua từng chi tiết đơn hàng và kiểm tra thời gian
                for (const orderDetail of orderDetails) {
                    for (const time of times) {
                        const scheduledTime = new Date(`${orderDate}T${time}:00`); // Thời gian từ mã QR
                        const detailTime = new Date(`${currentDateString}T${orderDetail.sessionTime}`); // Thời gian chi tiết đơn hàng
    
                        // Kiểm tra nếu thời gian từ QR trùng với thời gian chi tiết đơn hàng
                        if (scheduledTime.getTime() === detailTime.getTime()) {
                            const timeDiff = currentDate.getTime() - scheduledTime.getTime();
                            const oneHourInMillis = 60 * 60 * 1000; // Một giờ tính bằng mili giây
    
                            if (timeDiff < 0) {
                                console.log(`Khách hàng đến sớm cho chi tiết đơn hàng ID ${orderDetail.id}.`);
                                orderDetail.status = 'completed';
                                await this.orderDetailRepository.save(orderDetail);
                                console.log(`Đã cập nhật trạng thái chi tiết đơn hàng ID ${orderDetail.id} thành 'hoàn thành'.`);
                            } else if (timeDiff >= 0 && timeDiff <= oneHourInMillis) {
                                console.log(`Khách hàng đến đúng giờ cho chi tiết đơn hàng ID ${orderDetail.id}.`);
                                orderDetail.status = 'completed';
                                await this.orderDetailRepository.save(orderDetail);
                                console.log(`Đã cập nhật trạng thái chi tiết đơn hàng ID ${orderDetail.id} thành 'hoàn thành'.`);
                            } else {
                                console.log(`Khách hàng đến muộn cho chi tiết đơn hàng ID ${orderDetail.id}.`);
                                orderDetail.status = 'canceled';
                                await this.orderDetailRepository.save(orderDetail);
                                console.log(`Đã cập nhật trạng thái chi tiết đơn hàng ID ${orderDetail.id} thành 'hủy bỏ'.`);
                            }
                        } else {
                            console.log(`Thời gian theo lịch ${scheduledTime.toISOString()} không trùng với thời gian chi tiết ${detailTime.toISOString()}. Bỏ qua chi tiết đơn hàng ID ${orderDetail.id}.`);
                        }
                    }
                }
            } else {
                console.warn(`Dòng dữ liệu không khớp với định dạng mong đợi: ${line}`);
            }
        }
    }
}
