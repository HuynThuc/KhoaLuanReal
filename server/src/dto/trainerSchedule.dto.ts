// src/dto/trainerSchedule.dto.ts
export interface TrainerScheduleDTO {
    trainerId: number; // ID của huấn luyện viên
    date: string; // Ngày
    start_time: string; // Thời gian bắt đầu
    end_time: string; // Thời gian kết thúc
    day_of_week: number; // Ngày trong tuần
}
