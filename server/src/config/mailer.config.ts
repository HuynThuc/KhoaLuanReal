// src/config/mailer.config.ts
import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true nếu bạn dùng port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};
