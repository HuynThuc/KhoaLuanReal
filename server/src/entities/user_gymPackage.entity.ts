// src/entities/user_gymPackage.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity'; // Đổi từ GymPackage thành Service

@Entity('user_gym_package')
export class UserGymPackage {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.gymPackages)
    @JoinColumn({ name: 'user_id' }) // Liên kết với bảng User
    user!: User;

    @ManyToOne(() => Service, service => service.users) // Đổi GymPackage thành Service
    @JoinColumn({ name: 'service_id' }) // Đổi tên cột thành 'service_id'
    service!: Service; // Đổi tên trường thành 'service'
}
