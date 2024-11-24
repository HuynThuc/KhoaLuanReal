import React from 'react';

const BannerService = ({ image, serviceName, defaultImage, bookingImage, isBooking }) => {
  // Logic để xác định hình ảnh hiển thị
  const displayImage = image 
    ? `/images/${image}` 
    : (isBooking ? bookingImage : defaultImage);

  return (
    <div className="relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-35 before:z-10">
      <img src={displayImage} alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />
      <div className="min-h-[700px] relative z-0 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
        {/* Nội dung khác có thể được thêm ở đây */}
      </div>
      <div className="absolute bottom-12 left-64 z-50 text-white">
        <h1 className="shop-page-title is-xlarge pb-2 ">{serviceName}</h1>
        <div className="is-small">
          <nav className="woocommerce-breadcrumb breadcrumbs">
            <a href="">Trang chủ / Dịch vụ / {serviceName}</a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BannerService;
