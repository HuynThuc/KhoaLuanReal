// src/dto/order.dto.ts

export interface OrderDTO {
    userId: number;
    totalAmount: number;
    status: string; // Ví dụ: 'pending', 'completed', 'canceled'
}

export interface OrderDetailDTO {
    gymPackageId: number;
    trainerId: number;
    quantity: number;
    price: number;
    sessionDate: Date;
    sessionTime: string;
    promotionId: number;
    status: string;
}

// src/dto/order-detail-with-qr.dto.ts
export interface QRCodeDTO {
    orderId: number;
    date: Date; // hoặc Date, tùy thuộc vào cách bạn xử lý
    time: string;
    qrCode: string;
}



export interface RevenueStatisticsDTO {
    date: string;
    revenue: number;
    totalRevenue: number;
}

// DTO cho response khi lấy thông tin trainer được chọn nhiều nhất
export interface MostSelectedTrainerDTO {
    trainer: {
        id: number;
        name: string;
    };
    selectionCount: number;
}

// DTO cho response khi lấy thông tin gói tập được bán nhiều nhất
export interface MostPopularGymPackageDTO {
    gymPackage: {
        id: number;
        name: string;
    };
    salesCount: number;
}

