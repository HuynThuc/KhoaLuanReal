export interface ServiceDTO {
    serviceName: string;     // Tên gói tập
    description?: string; 
    content?: string;   // Mô tả của gói tập
    image?: string; 
    layout?: string         // Đường dẫn ảnh có thể là nullable
}
