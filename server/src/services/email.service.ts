// src/services/email.service.ts
// src/services/email.service.ts
import * as nodemailer from 'nodemailer';
import { emailConfig } from '../config/mailer.config';
import { orderConfirmationTemplate,  expirationReminderTemplate, welcomeEmailTemplate, promotionEmailTemplate} from '../utils/email.templates';
import { QRCodeDTO } from '../dto/order.dto';
import * as fs from 'fs'; // Thư viện fs để làm việc với tệp
import * as path from 'path'; // Thư viện path để làm việc với đường dẫn

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport(emailConfig);
    }


    async sendOrderConfirmation(order: any, userEmail: string, qrCodes: QRCodeDTO[]): Promise<void> {
        try {
            // Tạo một mảng để lưu các tệp đính kèm
            const attachments = await Promise.all(qrCodes.map(async (qrCode, index) => {
                const fileName = `qrcode_${qrCode.orderId}.png`; // Đặt tên cho tệp hình ảnh
                const filePath = path.join(__dirname, 'temp', fileName); // Đường dẫn đến thư mục tạm
    
                // Lưu mã QR vào tệp
                await fs.promises.writeFile(filePath, qrCode.qrCode.split(',')[1], { encoding: 'base64' });
    
                return {
                    filename: fileName,
                    path: filePath
                };
            }));
    
            const mailOptions = {
                from: process.env.SMTP_USER, // Người gửi email
                to: userEmail, // Địa chỉ email người nhận
                subject: 'Xác nhận đặt lịch tập gym thành công', // Tiêu đề email
                html: orderConfirmationTemplate(order, qrCodes), // Thêm qrCodes vào template
                attachments, // Đính kèm các tệp hình ảnh mã QR
            };
    
            // Gửi email
            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
    
            // Xóa các tệp hình ảnh sau khi gửi
            await Promise.all(attachments.map(attachment => fs.promises.unlink(attachment.path)));
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send confirmation email');
        }
    }
    


    // Phương thức gửi email chào mừng
    async sendWelcomeEmail(userName: string, userEmail: string, discountCode: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Chào mừng bạn đến với chúng tôi!',
            html: welcomeEmailTemplate(userName, discountCode),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully');
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }

    // Phương thức gửi email mã giảm giá đặc biệt
    async sendPromotionEmail(userEmail: string, promotionCode: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Mã giảm giá đặc biệt dành cho bạn!',
            html: promotionEmailTemplate(promotionCode),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Promotion email sent successfully');
        } catch (error) {
            console.error('Error sending promotion email:', error);
            throw new Error('Failed to send promotion email');
        }
    }


    async sendReminderEmail(userEmail: string, userName: string) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Thông báo gia hạn',
            html:  expirationReminderTemplate(userName),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
    
}
