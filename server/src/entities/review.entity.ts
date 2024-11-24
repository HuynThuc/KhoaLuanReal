// src/modules/review/entities/review.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../entities/user.entity'; // Import entity User
  
  @Entity('reviews') // Tên bảng trong cơ sở dữ liệu
  export class Review {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user!: User; // Liên kết với bảng User, người dùng đã đánh giá
  
    @Column('int')
    rating!: number; // Điểm số đánh giá (1 - 5 sao)
  
    @Column('text', { nullable: true })
    comment?: string; // Nội dung đánh giá, có thể để trống
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date; // Thời gian tạo đánh giá
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date; // Thời gian cập nhật đánh giá
  }
  