import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserGymPackage } from './user_gymPackage.entity';
import { GymPackage } from './gymPackage.entity';
import { Trainer } from './trainer.entity'; // Import Trainer

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    serviceName!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'text', nullable: true })
    content?: string;
    
    @Column({ type: 'varchar', length: 50, nullable: true }) // Thêm cột layout
    layout?: string; // Kiểu layout cho gói tập

    @Column({ type: 'varchar', nullable: true })
    image?: string;

    @OneToMany(() => UserGymPackage, userGymPackage => userGymPackage.service)
    users!: UserGymPackage[];

    @OneToMany(() => GymPackage, gymPackage => gymPackage.service) // Thêm quan hệ với GymPackage
    gymPackages!: GymPackage[];

    @OneToMany(() => Trainer, trainer => trainer.service) // Thêm quan hệ với Trainer
    trainers!: Trainer[];
}
