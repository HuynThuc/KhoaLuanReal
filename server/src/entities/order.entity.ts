import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { User } from './user.entity'; // Liên kết với bảng User

@Entity('orders') // Tên bảng trong cơ sở dữ liệu
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' }) // Cột user_id trong bảng orders
    user!: User; // Liên kết đến người dùng đặt hàng

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount!: number; // Tổng số tiền của đơn hàng

    @Column({ type: 'varchar', length: 255 })
    status!: string; // Trạng thái đơn hàng (pending, completed, canceled, v.v.)

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails!: OrderDetail[]; // Quan hệ với bảng OrderDetail
}
