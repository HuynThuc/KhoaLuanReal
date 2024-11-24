import { QRCodeDTO } from "../dto/order.dto";
export const orderConfirmationTemplate = (orderDetails: any, qrCodes: QRCodeDTO[]) => {
    return `
    <h2>Xác nhận đặt lịch tập gym thành công</h2>
    <p>Cảm ơn bạn đã đặt lịch tập. Dưới đây là chi tiết lịch tập của bạn:</p>
    
    <h3>Chi tiết đơn hàng:</h3>
    <ul>
        ${orderDetails.orderDetails.map((detail: any) => {
            const qrCode = detail.order && detail.order.id 
                ? qrCodes.find(qr => qr.orderId === detail.order.id)?.qrCode 
                : '';

            return `
                <li>
                    <p>Ngày: ${detail.sessionDate || 'Không xác định'}</p>
                    <p>Thời gian: ${detail.sessionTime || 'Không xác định'}</p>
                    <p>Huấn luyện viên: ${detail.trainer ? detail.trainer.trainerName : 'Không xác định'}</p>
                    <p>Gói tập: ${detail.gymPackage ? detail.gymPackage.name : 'Không xác định'}</p>
                    <p>Giá: ${detail.price || 'Không xác định'}</p>
                    <p>Mã QR:</p>
                    <img src="${qrCode}"/>
                </li>
            `;
        }).join('')}
    </ul>
    
    <p>Tổng số tiền: ${orderDetails.totalAmount || 'Không xác định'}</p>
    
    <p>Vui lòng đến đúng giờ để bắt đầu buổi tập của bạn.</p>
    <p>Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.</p>
    `;
};





export const welcomeEmailTemplate = (userName: string, discountCode: string) => {
    return `
    <h2>Chào mừng bạn đến với chúng tôi, ${userName}!</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản. Chúng tôi rất vui mừng chào đón bạn gia nhập cộng đồng của chúng tôi!</p>
    <p>Để chào mừng bạn, chúng tôi muốn gửi tặng bạn một mã giảm giá đặc biệt:</p>
    <h3>Mã giảm giá: ${discountCode}</h3>
    <p>Mã này giảm 10% cho lần mua hàng tiếp theo của bạn.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
    <p>Chúc bạn có trải nghiệm tuyệt vời với dịch vụ của chúng tôi!</p>
    `;
};

// src/utils/email.templates.ts

export const promotionEmailTemplate = (promotionCode: string) => `
    <h2>Chào bạn!</h2>
    <p>Chúng tôi rất vui thông báo bạn nhận được một mã giảm giá đặc biệt!</p>
    <p><strong>Mã giảm giá của bạn: ${promotionCode}</strong></p>
    <p>Hãy sử dụng mã này để nhận ưu đãi khi mua gói tập luyện tiếp theo.</p>
    <p>Chúc bạn một ngày tốt lành!</p>
`;


export const expirationReminderTemplate = (userName: string) => `
    <h2>Xin chào ${userName},</h2>
    <p>Bạn chỉ còn lại 1 buổi tập. Hãy nhanh chóng gia hạn gói tập của mình để không bị gián đoạn.</p>
    <p>Chúng tôi rất hân hạnh được phục vụ bạn. Chúc bạn tập luyện hiệu quả!</p>
`;



