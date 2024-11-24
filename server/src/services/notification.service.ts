import * as cron from 'node-cron';
import { Order } from '../entities/order.entity';
import { EmailService } from './email.service';
import { Repository } from 'typeorm';
import { OrderDetail } from '../entities/order_detail.entity';
import { AppDataSource } from '../database/db';

export class NotificationService {
    private emailService: EmailService;
    private orderRepository: Repository<Order>;
    private orderDetailRepository: Repository<OrderDetail>;

    constructor(
        orderRepository: Repository<Order> = AppDataSource.getRepository(Order),
        orderDetailRepository: Repository<OrderDetail> = AppDataSource.getRepository(OrderDetail),
    ) {
        this.emailService = new EmailService();
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.initCronJob();
    }

    private initCronJob() {
        cron.schedule('8 0 * * *', async () => {
            console.log('Cron job running every minute'); // Kiểm tra xem cron job có chạy không
            await this.checkAndNotifyUsers();
        });
    }
    

    private async checkAndNotifyUsers() {
        const orders = await this.orderRepository.find({
            relations: ['user', 'orderDetails']
        });

        for (const order of orders) {
            const remainingSessions = await this.countRemainingSessions(order.id);

            if (remainingSessions === 1) {
                await this.emailService.sendReminderEmail(order.user.email, order.user.username);
            }
        }
    }

    private async countRemainingSessions(orderId: number): Promise<number> {
        const remainingDetails = await this.orderDetailRepository.count({
            where: { order: { id: orderId }, status: 'pending' }
        });
        return remainingDetails;
    }
}
