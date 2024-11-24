import BookingHeader from "../component/BookingStep/BookingHeader";
import Payment from "../component/Payment/Payment"
import BannerService from "../component/Banner/bannerService";
import { useLocation, useNavigate } from 'react-router-dom';

const bookingImage = '/images/anh-mo-ta.png'; // Hình ảnh mặc định cho trang đặt chỗ


function ThanhToan() {

  const location = useLocation();
  const { trainerName, serviceName, selectedTimesFormatted} = location.state || {};

    return (
      <div className="bg-white text-black">
       <BannerService 
       isBooking={true}
        serviceName="Booking"
        bookingImage={bookingImage} // Truyền hình ảnh đặt chỗ
      />
      <BookingHeader 
          currentStep={3}
          serviceSubtitle={serviceName} selectedTrainer={trainerName}
          selectedTimes={selectedTimesFormatted}
      />
      <Payment/>
  </div>
    );
  }
  
  export default ThanhToan;
  