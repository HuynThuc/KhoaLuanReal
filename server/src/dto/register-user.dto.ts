export interface RegisterUserDTO {
    username: string;
    email: string;
    password: string;
    roleId: number; // Thêm roleId vào DTO
}


// dto/google-auth.dto.ts
export interface GoogleUserDTO {
    googleId: string;
    email: string;
    username: string;
    
}
