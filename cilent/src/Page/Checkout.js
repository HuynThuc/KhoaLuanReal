import React, { useEffect, useState } from "react";
import PaymentForm from "../component/Payment/Payment";
import TrainerCard from "../component/TrainerCard/trainercard";
import BookingHeader from "../component/BookingStep/BookingHeader";
import BannerService from "../component/Banner/bannerService";
import { useLocation, useNavigate } from 'react-router-dom';


const bookingImage = '/images/booking.jpg'; // Hình ảnh mặc định cho trang đặt chỗ

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceName, serviceId, price, planId, weeks, sessionsPerWeek, durationInMonths } = location.state || {};
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);


  useEffect(() => {
    const fetchTrainersByService = async () => {
      try {
        const response = await fetch(`http://localhost:3002/trainer/getTrainerByService/${serviceId}`);
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    if (serviceId) {
      fetchTrainersByService();
    }
  }, [serviceId]);

  const handleSelectTrainer = (trainerId, trainerName) => {
    setSelectedTrainer(trainerName);
    navigate('/time', { 
      state: { 
        trainerId, 
        trainerName,
        serviceName,
        price, 
        planId, 
        weeks, 
        sessionsPerWeek, 
        durationInMonths,
        currentStep: 2 
      } 
    });
  };

  return (
    <div className="bg-white text-white">
      <BannerService 
      isBooking={true}
        serviceName="Booking"
        bookingImage={bookingImage} // Truyền hình ảnh đặt chỗ
      />
      <BookingHeader currentStep={1} serviceSubtitle={serviceName} selectedTrainer={selectedTrainer} />
      <TrainerCard trainers={trainers} price={price} planId={planId} onSelectTrainer={handleSelectTrainer} />
    </div>
  );
}

export default Checkout;
