import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Promotion } from './promotion.entity';

@Entity('user_promotions')
export class UserPromotion {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.userPromotions)
    @JoinColumn({ name: 'user_id' })
    user!: User; // Liên kết đến user nhận mã giảm giá

    @ManyToOne(() => Promotion, promotion => promotion.userPromotions)
    @JoinColumn({ name: 'promotion_id' })
    promotion!: Promotion; // Liên kết đến mã giảm giá mà user được gán

    @Column({ default: false })
    isUsed!: boolean; // Cờ xác định mã này đã được sử dụng hay chưa

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
