import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,JoinColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { UserPromotion } from './user_promotions.entity';
import { GymPackage } from './gymPackage.entity'; // Liên kết với GymPackage

@Entity('promotions')
export class Promotion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string; // Tên của khuyến mãi

    @Column({ type: 'text', nullable: true })
    description?: string; // Mô tả khuyến mãi (có thể để trống)

    @Column({ type: 'varchar', length: 50, unique: true })
    code!: string; // Mã giảm giá duy nhất cho khuyến mãi

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    discountPercent!: number; // Phần trăm giảm giá

    @Column({ type: 'enum', enum: ['welcome', 'public', 'special'], default: 'welcome' })
    type!: 'welcome' | 'public' | 'special'; // Loại khuyến mãi

    @Column()
    startDate!: string; // Ngày bắt đầu khuyến mãi

    @Column()
    endDate!: string; // Ngày kết thúc khuyến mãi

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.promotion)
    orderDetails!: OrderDetail[]; // Quan hệ với OrderDetail, nơi áp dụng khuyến mãi này

    @OneToMany(() => UserPromotion, userPromotion => userPromotion.promotion)
    userPromotions!: UserPromotion[]; // Quan hệ với bảng UserPromotion

    // Quan hệ ManyToOne với GymPackage để chỉ định gói tập áp dụng khuyến mãi
    @ManyToOne(() => GymPackage, gymPackage => gymPackage.promotions, { nullable: true })
    @JoinColumn({ name: 'gym_package_id' }) // Cột liên kết với GymPackage
    gymPackage?: GymPackage | null;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
