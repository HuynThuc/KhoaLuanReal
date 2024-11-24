import { Request, Response, Router } from 'express';
import { OrderService } from '../services/order.service';
import { OrderDTO, OrderDetailDTO, RevenueStatisticsDTO} from '../dto/order.dto';

const orderService = new OrderService();
const router = Router();

// POST: Create a new order
router.post('/createOrder', async (req: Request, res: Response) => {
    try {
        const { userId, totalAmount, status, orderDetails } = req.body;

        const orderData: OrderDTO = { userId, totalAmount, status };
        const orderDetailsData: OrderDetailDTO[] = orderDetails;

        const newOrder = await orderService.createOrder(orderData, orderDetailsData);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});


// GET: Lấy thông tin chi tiết đơn hàng theo userId
router.get('/getOrderDetailsByUser/:userId', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }

        const orderDetails = await orderService.getOrderDetailsByUserId(userId);

        res.status(200).json({ orderDetails });
    } catch (error) {
        console.error('Error fetching order details by user ID:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

router.get('/getOrderdetailbyTrainer/:trainerId', async (req: Request, res: Response) => {
    try {
        const trainerId = parseInt(req.params.trainerId);

        if (isNaN(trainerId)) {
            res.status(400).json({ message: 'Invalid trainerId' });
            return;
        }

        const orderDetails = await orderService.getOrderDetailsByTrainerId(trainerId);

        res.status(200).json({ orderDetails });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
})

// GET: Lấy tất cả các đơn hàng
router.get('/getAllOrders', async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders(); // Gọi phương thức lấy tất cả đơn hàng từ OrderService

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Error fetching all orders' });
    }
});




router.get('/revenueStatistics', async (req: Request, res: Response) => {
    try {
        const { period } = req.query;

        if (!period) {
            res.status(400).json({ message: 'period là bắt buộc' });
            return;
        }

        const validPeriods = ['daily', 'monthly'];
        if (!validPeriods.includes(period as string)) {
            res.status(400).json({ message: 'period phải là daily hoặc monthly' });
            return;
        }

        let start: Date | undefined;
        let end: Date | undefined;

        if (period === 'daily') {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                res.status(400).json({ message: 'startDate và endDate là bắt buộc khi period là daily' });
                return;
            }

            start = new Date(startDate as string);
            end = new Date(endDate as string);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                res.status(400).json({ message: 'startDate và endDate không hợp lệ' });
                return;
            }
        }

        const { statistics, totalRevenue, mostSelectedTrainer, mostPopularGymPackage, trainerPercentage, gymPackagePercentage } = await orderService.getRevenueStatistics(
            start,
            end,
            period as 'daily' | 'monthly'
        );

        res.status(200).json({
            revenueStatistics: statistics,
            totalRevenue,
            mostSelectedTrainer,
            mostPopularGymPackage,
            trainerPercentage,
            gymPackagePercentage
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê doanh thu:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thống kê doanh thu' });
    }
});

// POST: Check QR Code
router.post('/checkQRCode', async (req: Request, res: Response) => {
    try {
        const { qrData } = req.body;

        if (!qrData) {
            res.status(400).json({ message: 'qrData là bắt buộc' });
            return;
        }

        await orderService.checkQRCode(qrData);
        res.status(200).json({ message: 'QR Code checked successfully' });
    } catch (error) {
        console.error('Error checking QR Code:', error);
        res.status(500).json({ message: 'Error checking QR Code' });
    }
});



export default router;
