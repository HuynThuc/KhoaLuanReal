import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AppDataSource } from '../database/db';
import { User } from '../entities/user.entity';
import passport from 'passport';
import { GoogleUserDTO } from '../dto/register-user.dto';

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);

// Đăng ký
router.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            Status: 'Success',
            Message: 'Đăng ký thành công',
            user
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ Status: 'Error', Message: error.message });
        } else {
            res.status(500).json({ Status: 'Error', Message: 'An unknown error occurred' });
        }
    }
});

// Đăng nhập
router.post('/login', async (req: Request, res: Response) => {
    try {
        const tokens = await authService.login(req.body);
        res.json(tokens);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Refresh token
router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const tokens = await authService.refreshToken(req.body.refresh_token);
        res.json(tokens);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Lấy tất cả users
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await authService.getAllUsers();
        res.json({
            Status: 'Success',
            users
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

// Google Authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback
// Sau khi xác thực thành công, tạo token và gửi nó về frontend trong cookie
// Backend - Google callback route
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const googleUser = req.user as GoogleUserDTO;
            console.log('Authenticated Google User:', googleUser); // Log thông tin người dùng đã xác thực
            const tokens = await authService.googleLogin(googleUser);
            res.cookie('access_token', tokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600 * 1000,
            });

            res.redirect(`${process.env.FRONTEND_URL}?token=${tokens.access_token}`);
        } catch (error) {
            console.error('Error during Google Callback:', error); // Log lỗi nếu có
            res.redirect('/login/error');
        }
    }
);





export default router;