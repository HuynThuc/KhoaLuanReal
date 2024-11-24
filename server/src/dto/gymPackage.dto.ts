export interface GymPackageDTO {
    name: string; // Tên gói tập
    description?: string; // Mô tả gói tập
    price: number; // Giá của gói tập
    serviceId: number; // ID của dịch vụ tương ứng
    // Kiểu layout cho gói tập (có thể là 'image-left', 'image-right', v.v.)
}
