// src/dto/promotion.dto.ts

export interface PromotionDTO {
    name: string;
    description?: string;
    code?: string; // Mã giảm giá
    discountPercent: number; // Phần trăm giảm giá
    startDate: string;
    endDate: string;
    gymPackageId: number;
}
