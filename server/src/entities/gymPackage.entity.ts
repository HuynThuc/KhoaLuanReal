import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrderDetail } from './order_detail.entity'; // Liên kết với OrderDetail
import { Service } from './service.entity';
import { Promotion } from './promotion.entity'; // Liên kết với Promotion

@Entity('gym_package')
export class GymPackage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string; // Tên gói tập, ví dụ: "Basic", "Premium"

    @Column({ type: 'text', nullable: true })
    description?: string; // Mô tả gói tập

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number; // Giá của gói tập

    @Column({ type: 'int', nullable: true }) // Số tuần, có thể để NULL
    weeks?: number;

    @Column({ type: 'int', nullable: true }) // Số buổi mỗi tuần, có thể để NULL
    sessionsPerWeek?: number;

    @Column({ type: 'int', nullable: true }) // Thời gian gói tập (tháng), có thể để NULL
    durationInMonths?: number;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.gymPackage)
    orderDetails!: OrderDetail[]; // Quan hệ với bảng OrderDetail

    @ManyToOne(() => Service, service => service.gymPackages, { nullable: true }) // Cho phép service là null
    @JoinColumn({ name: 'service_id' }) // Cột liên kết với bảng Service
    service?: Service | null; // Dịch vụ tương ứng có thể là null

     // Quan hệ OneToMany ngược với Promotion
     @OneToMany(() => Promotion, promotion => promotion.gymPackage)
     promotions!: Promotion[];

   
}
