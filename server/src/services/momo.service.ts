// src/services/momo.service.ts
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import crypto from 'crypto';
import { MomoPaymentConfig, MomoPaymentRequest, MomoPaymentResponse, CheckStatusDto } from '../dto/momo.dto';
import { OrderService } from './order.service'; // Import OrderService
import { OrderDTO, OrderDetailDTO } from '../dto/order.dto'; // Import DTO để sử dụng

export class MomoService {
    private config: MomoPaymentConfig = {
        accessKey: 'F8BBA842ECF85',
        secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
        orderInfo: 'pay with MoMo',
        partnerCode: 'MOMO',
        redirectUrl: 'http://localhost:3000/thank', //đường dẫn đến khi thanh toán thành công
        ipnUrl: 'https://dc56-2405-4802-93b7-cf20-9d3b-1a84-30e4-61da.ngrok-free.app/payment/callback', //link call back trả về kết quả thành côcng
        requestType: 'payWithMethod',
        lang: 'vi'
    };


    private orderService: OrderService; // Khai báo orderService

    constructor() {
        this.orderService = new OrderService(); // Khởi tạo orderService
    }

    private createSignature(rawSignature: string): string {
        return crypto
            .createHmac('sha256', this.config.secretKey)
            .update(rawSignature)
            .digest('hex');
    }

    async createPayment(paymentData: MomoPaymentRequest, orderData: OrderDTO, orderDetailsData: OrderDetailDTO[]): Promise<MomoPaymentResponse> {
        try {
            // Tạo orderId duy nhất
            const orderId = uuidv4(); // Thay thế orderId bằng UUID mới

            // Tạo đơn hàng trước khi thanh toán
            const completedOrder = await this.orderService.createOrder(orderData, orderDetailsData);

            // Tạo requestId duy nhất
            const requestId = new Date().getTime().toString();

            // Tạo chuỗi rawSignature
            const rawSignature =
                "accessKey=" + this.config.accessKey +
                "&amount=" + paymentData.amount +
                "&extraData=" + (paymentData.extraData || '') +
                "&ipnUrl=" + this.config.ipnUrl +
                "&orderId=" + orderId + // Sử dụng orderId duy nhất
                "&orderInfo=" + (paymentData.orderInfo || this.config.orderInfo) +
                "&partnerCode=" + this.config.partnerCode +
                "&redirectUrl=" + this.config.redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + this.config.requestType;

            // Tạo signature
            const signature = this.createSignature(rawSignature);

            // Tạo request body
            const requestBody = {
                partnerCode: this.config.partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId: requestId,
                amount: paymentData.amount,
                orderId: orderId,
                orderInfo: paymentData.orderInfo || this.config.orderInfo,
                redirectUrl: this.config.redirectUrl,
                ipnUrl: this.config.ipnUrl,
                lang: this.config.lang,
                requestType: this.config.requestType,
                autoCapture: true,
                extraData: paymentData.extraData || '',
                signature: signature
            };

            // Gọi API MoMo
            const response = await axios.post<MomoPaymentResponse>(
                'https://test-payment.momo.vn/v2/gateway/api/create',
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error creating MoMo payment:', error);
            throw new Error('Không thể tạo thanh toán MoMo');
        }
    }

   

    // Thêm phương thức checkTransactionStatus
    async checkTransactionStatus(checkStatusData: CheckStatusDto): Promise<any> {
        try {
            // Tạo request body cho việc kiểm tra trạng thái giao dịch
            const requestBody = {
                partnerCode: this.config.partnerCode,
                accessKey: this.config.accessKey,
                requestId: new Date().getTime().toString(),
                orderId: checkStatusData.orderId, // ID đơn hàng cần kiểm tra
                signature: this.createSignature(
                    `accessKey=${this.config.accessKey}&orderId=${checkStatusData.orderId}&partnerCode=${this.config.partnerCode}&requestId=${new Date().getTime().toString()}`
                ),
            };

            // Gọi API MoMo để kiểm tra trạng thái giao dịch
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error checking transaction status:', error);
            throw new Error('Không thể kiểm tra trạng thái giao dịch');
        }




    }
}
