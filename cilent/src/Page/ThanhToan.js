import BookingHeader from "../component/BookingStep/BookingHeader";
import Payment from "../component/Payment/Payment";
import BannerService from "../component/Banner/bannerService";
import { useLocation } from 'react-router-dom';

const bookingImage = '/images/booking.jpg'; // Hình ảnh mặc định cho trang đặt chỗ

function ThanhToan() {
  const location = useLocation();
  const { planId, price, trainerName, serviceName, selectedTimesFormatted } = location.state || {};

  return (
    <div className="bg-white text-black">
      <BannerService
        isBooking={true}
        serviceName="Booking"
        bookingImage={bookingImage} // Truyền hình ảnh đặt chỗ
      />
      {/* Kiểm tra nếu không có dữ liệu từ BookingHeader thì không hiển thị nó */}
      {(trainerName && serviceName && selectedTimesFormatted) && (
        <BookingHeader
          currentStep={3}
          serviceSubtitle={serviceName}
          selectedTrainer={trainerName}
          selectedTimes={selectedTimesFormatted}
        />
      )}
 <Payment planId={planId} price={price} />
    </div>
  );
}

export default ThanhToan;
