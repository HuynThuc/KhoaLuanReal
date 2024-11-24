import React from "react";
import { useLocation } from 'react-router-dom';
import BookingHeader from "../component/BookingStep/BookingHeader";
import BannerService from "../component/Banner/bannerService";
import WeeklySchedule from "../component/WeeklySchedule/WeeklySchedule";

const bookingImage = '/images/anh-mo-ta.png'; // Hình ảnh mặc định cho trang đặt chỗ

function Booking() {

    const location = useLocation();
    console.log("Location state:", location.state); // Xem thông tin nhận được từ location.state
    const { trainerName, serviceName } = location.state || {}; // Lấy tên huấn luyện viên và tên dịch vụ từ state

    return (
        <div className="bg-white text-white">
            <BannerService
            isBooking={true}
                serviceName="Booking"
                bookingImage={bookingImage} // Truyền hình ảnh đặt chỗ
            />
            <BookingHeader currentStep={2} selectedTrainer={trainerName} serviceSubtitle={serviceName} /> {/* Truyền tên huấn luyện viên và subtitle dịch vụ */}
            <WeeklySchedule />
        </div>
    );
}

export default Booking;
