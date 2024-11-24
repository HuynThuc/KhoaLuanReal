import React from 'react';
import BannerService from "../component/Banner/bannerService";
import ServiceCard from "../component/ServiceCard/ServiceCard";
import RegistrationForm from '../component/RegisterForm/RegisterForm';

const defaultImage = '/images/dichvu-dt.jpg'; // Thay thế bằng đường dẫn tới hình ảnh mặc định của bạn

function Service() {
  return (
    <div className="bg-custom text-white">
      <BannerService defaultImage={defaultImage} serviceName="Dịch vụ của chúng tôi" />  {/* Sử dụng hình ảnh mặc định */}
      <ServiceCard />
      <RegistrationForm/>
    </div>
  );
}

export default Service;
