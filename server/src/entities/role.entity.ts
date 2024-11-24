// src/modules/roles/entities/role.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
} from 'typeorm';

@Entity('roles') // 'roles' là tên bảng trong cơ sở dữ liệu
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string; // Tên của vai trò (ví dụ: 'admin', 'user')
}
