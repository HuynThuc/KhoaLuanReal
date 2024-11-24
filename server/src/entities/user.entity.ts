import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { UserGymPackage } from './user_gymPackage.entity';
import { Order } from './order.entity';
import { UserPromotion } from './user_promotions.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    username!: string;

    @Column({ length: 255 })
    email!: string;

    @Column()
    password!: string;

    @Column()
    refresh_token!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @Column({ nullable: true })
    googleId?: string;
    

    @ManyToOne(() => Role, role => role.id)
    @JoinColumn({ name: 'role_id' })
    role!: Role;

    @OneToMany(() => UserGymPackage, userGymPackage => userGymPackage.user)
    gymPackages!: UserGymPackage[];

    @OneToMany(() => Order, order => order.user)
    orders!: Order[];

    @OneToMany(() => UserPromotion, userPromotion => userPromotion.user)
    userPromotions!: UserPromotion[]; // Quan hệ với bảng UserPromotion
}
