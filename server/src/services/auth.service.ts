import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterUserDTO, GoogleUserDTO } from '../dto/register-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmailService } from './email.service';
import { PromotionService } from './promotion.service';

export class AuthService {
    private userRepository: Repository<User>;
    private emailService: EmailService;
    private promotionService: PromotionService;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
        this.emailService = new EmailService();
        this.promotionService = new PromotionService();
    }

    async register(registerUserDTO: RegisterUserDTO): Promise<User> {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await this.userRepository.findOne({ where: { email: registerUserDTO.email } });
        
        if (existingUser) {
            throw new Error('Email đã được sử dụng. Vui lòng chọn email khác.');
        }
    
        const hashPassword = await this.hashPassword(registerUserDTO.password);
    
        // Gán roleId mặc định là 2 nếu không được chỉ định
        const roleId = registerUserDTO.roleId || 2;
    
        const user = await this.userRepository.save({
            ...registerUserDTO,
            refresh_token: "reresasdasd", // Gán refresh_token
            password: hashPassword,
            role: { id: roleId } // Gán roleId vào người dùng
        });
    
        // Tạo mã giảm giá chào mừng và gửi email
        const promotion = await this.promotionService.createWelcomePromotion(user.id);
        await this.emailService.sendWelcomeEmail(user.username, user.email, promotion.code);
    
        return user;
    }
    
    
    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        return await bcrypt.hash(password, salt);
    }

    async login(loginUserDTO: LoginUserDTO): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email: loginUserDTO.email }, relations: ['role'] }); // Lấy thông tin vai trò
        if (!user) {
            throw new Error("Email does not exist");
        }
    
        const checkPass = await bcrypt.compare(loginUserDTO.password, user.password);
        if (!checkPass) {
            throw new Error("Password is not correct");
        }
    
        // Thêm roleId vào payload
        const payload = { id: user.id, username: user.username, email: user.email, roleId: user.role.id };
        return this.generateToken(payload);
    }
    
    private async generateToken(payload: { id: number; username: string; email: string; roleId: number }) {
        const access_token = jwt.sign(payload, '123456', { expiresIn: '1m' }); // Đặt thời gian hết hạn cho access token
        const refresh_token = jwt.sign(payload, '123456', { expiresIn: '1d' }); // Đặt thời gian hết hạn cho refresh token
    
        await this.userRepository.update(
            { email: payload.email },
            { refresh_token }
        );
    
        return { access_token, refresh_token };
    }
    
    

    async refreshToken(refresh_token: string): Promise<any> {
        // Xác thực refresh token
        const verify = jwt.verify(refresh_token, '123456') as JwtPayload; // Chuyển đổi kiểu sang JwtPayload
        const user = await this.userRepository.findOne({ where: { email: verify.email, refresh_token }, relations: ['role'] });
    
        if (!user) {
            throw new Error('Refresh token is not valid');
        }
    
        // Thêm roleId vào payload
        return this.generateToken({ id: verify.id, username: user.username, email: verify.email, roleId: user.role.id });
    }
    


      // Phương thức để lấy tất cả người dùng
    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }


    async googleLogin(googleUserData: GoogleUserDTO): Promise<any> {
        try {
            // Check if user exists
            let user = await this.userRepository.findOne({ 
                where: [
                    { googleId: googleUserData.googleId },
                    { email: googleUserData.email }
                ],
                relations: ['role']
            });

            if (!user) {
                // Create new user if doesn't exist
                user = await this.userRepository.save({
                    username: googleUserData.username,
                    email: googleUserData.email,
                    googleId: googleUserData.googleId,

                    password: await this.hashPassword(Math.random().toString(36)), // Random password for Google users
                    refresh_token: "",
                    role: { id: 2 } // Default role for Google users
                });

                // Create welcome promotion for new users
                const promotion = await this.promotionService.createWelcomePromotion(user.id);
                await this.emailService.sendWelcomeEmail(user.username, user.email, promotion.code);
            }

            // Generate tokens
            const payload = { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                roleId: user.role.id 
            };
            return this.generateToken(payload);
        } catch (error) {
            throw new Error('Google authentication failed');
        }
    }
    
}
