// src/interfaces/momo.interface.ts
export interface MomoPaymentConfig {
    accessKey: string;
    secretKey: string;
    orderInfo: string;
    partnerCode: string;
    redirectUrl: string;
    ipnUrl: string;
    requestType: string;
    lang: string;
}

export interface MomoPaymentRequest {
    amount: string;
    orderInfo?: string;
    extraData?: string;
}

export interface MomoPaymentResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: string;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
}

// src/dto/check-status.dto.ts
export interface CheckStatusDto {
    orderId: string; // Đảm bảo orderId là một số
}
