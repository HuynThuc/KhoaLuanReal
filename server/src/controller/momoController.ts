// src/controllers/momo.controller.ts
import { Router, Request, Response } from 'express';
import { MomoService } from '../services/momo.service';
import { MomoPaymentRequest } from '../dto/momo.dto';
import { OrderDTO, OrderDetailDTO } from '../dto/order.dto';
import { CheckStatusDto } from '../dto/momo.dto';

const router = Router();
const momoService = new MomoService(); // Khởi tạo MomoService

// Tạo thanh toán MoMo
router.post('/create-payment', async (req: Request, res: Response) => {
    try {
        const orderData: OrderDTO = {
            userId: req.body.userId,
            totalAmount: Number(req.body.totalAmount),
            status: 'pending'
        };

        const orderDetailsData: OrderDetailDTO[] = req.body.orderDetails; // Dữ liệu chi tiết đơn hàng

        // Kiểm tra kiểu dữ liệu để tránh lỗi
        if (!Number.isFinite(orderData.totalAmount) || orderData.totalAmount <= 0) {
            throw new Error('Invalid total amount');
        }

        // Tạo paymentData cho MoMo
        const paymentData: MomoPaymentRequest = {
            amount: orderData.totalAmount.toString(), // Đảm bảo giá là kiểu string
            orderInfo: `Payment for Order ID: ${orderData.userId}`, // Thông tin đơn hàng
            extraData: '', // Dữ liệu bổ sung nếu cần
        };

        // Tạo thanh toán MoMo
        const response = await momoService.createPayment(paymentData, orderData, orderDetailsData); // Cung cấp đủ tham số

        res.status(200).json({
            status: 'Success',
            message: 'Tạo thanh toán thành công',
            data: response
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 'Error',
                message: error.message
            });
        } else {
            res.status(500).json({
                status: 'Error',
                message: 'Đã xảy ra lỗi không xác định'
            });
        }
    }
});

// Thêm route callback từ MoMo
router.post('/callback', (req: Request, res: Response) => {
    console.log('MoMo Callback Data:', req.body);
    
    // Trả về response cho MoMo
    res.status(200).json({
        status: 'Success',
        message: 'Đã nhận được callback từ MoMo'
    });
});




// Thêm route kiểm tra trạng thái giao dịch
router.post('/check-status-transaction', async (req: Request, res: Response) => {
    try {
        const checkStatusData: CheckStatusDto = {
            orderId: req.body.orderId // ID của đơn hàng cần kiểm tra
        };

        // Kiểm tra trạng thái giao dịch
        const response = await momoService.checkTransactionStatus(checkStatusData);

        res.status(200).json({
            status: 'Success',
            message: 'Kiểm tra trạng thái giao dịch thành công',
            data: response
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                status: 'Error',
                message: error.message
            });
        } else {
            res.status(500).json({
                status: 'Error',
                message: 'Đã xảy ra lỗi không xác định'
            });
        }
    }
});


export default router;
