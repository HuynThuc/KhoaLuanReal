import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'khoaluan1',
    entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'], // Tìm tất cả các entity trong thư mục entities
    synchronize: true,
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Kết nối cơ sở dữ liệu đã được khởi tạo!");
    } catch (error) {
        console.error("Lỗi trong quá trình khởi tạo kết nối cơ sở dữ liệu:", error);
        throw error;
    }
};