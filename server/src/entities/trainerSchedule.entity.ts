import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Trainer } from './trainer.entity'; // Import Trainer

@Entity()
export class TrainerSchedule {
    @PrimaryGeneratedColumn()
    id!: number; // Sử dụng dấu '!' để TypeScript hiểu rằng giá trị này sẽ được gán sau

    @ManyToOne(() => Trainer, trainer => trainer.schedules) // Liên kết với Trainer
    trainer!: Trainer; // Trường này liên kết đến huấn luyện viên

    @Column()
    date!: string; // Hoặc kiểu Date tùy theo cách lưu trữ

    @Column()
    start_time!: string; // Thời gian bắt đầu của khoảng thời gian rảnh

    @Column()
    end_time!: string; // Thời gian kết thúc của khoảng thời gian rảnh

    @Column()
    day_of_week!: number; // Ví dụ: 1 cho Thứ 2, 7 cho Chủ nhật
}
