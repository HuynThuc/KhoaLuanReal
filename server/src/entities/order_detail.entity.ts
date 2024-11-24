import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Trainer } from './trainer.entity';
import { GymPackage } from './gymPackage.entity';
import { Promotion } from './promotion.entity';

@Entity('order_details')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, order => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @ManyToOne(() => Trainer, trainer => trainer.orderDetails, { nullable: true })
    @JoinColumn({ name: 'trainer_id' })
    trainer?: Trainer;

    @ManyToOne(() => GymPackage, gymPackage => gymPackage.orderDetails)
    @JoinColumn({ name: 'package_id' })
    gymPackage!: GymPackage;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({ type: 'date' })
    sessionDate!: Date;

    @Column({ type: 'time' })
    sessionTime!: string;

    @ManyToOne(() => Promotion, { nullable: true })
    @JoinColumn({ name: 'promotion_id' })
    promotion?: Promotion;

    @Column({ type: 'varchar', length: 50, default: 'pending' }) // Thêm cột status
    status!: string; // Các giá trị có thể là 'pending', 'completed', 'canceled'

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
