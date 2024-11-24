// // config/passport.config.ts
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { AppDataSource } from '../database/db';
// import { User } from '../entities/user.entity';

// const userRepository = AppDataSource.getRepository(User);

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//             callbackURL: 'http://localhost:3002/auth/google/callback',
//             scope: ['profile', 'email'],
            
//         },
//         async (_accessToken, _refreshToken, profile, done) => {
//             try {
//                 console.log('Google Profile:', profile); // Thêm log để kiểm tra thông tin profile từ Google
//                 const googleUser = {
//                     googleId: profile.id,
//                     email: profile.emails![0].value,
//                     username: profile.displayName,
//                 };
//                 done(null, googleUser);
//             } catch (error) {
//                 console.error('GoogleStrategy Error:', error); // In lỗi nếu có
//                 done(error as Error, undefined);
//             }
//         }
//     )
// );


// passport.serializeUser((user: any, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user: any, done) => {
//     done(null, user);
// });