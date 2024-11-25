import React from 'react';
 // Thêm video vào thư mục assets

const HeroSection = () => {
  const scrollToRegistrationForm = () => {
    const registrationSection = document.getElementById('registration-form');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section relative">
      {/* Video nền */}
      <video
        className="hs-video absolute top-0 left-0 w-full h-full object-cover"
        src="/images/video1.mp4"
        autoPlay
        loop
        muted
      />
      
      <div className="hs-item flex items-center justify-center h-[100vh] md:h-[100vh] lg:h-[100vh] text-center relative z-10">
  <div className="container mx-auto px-4 md:px-8 lg:px-0">
    <div className="flex items-center justify-center">
      <div className="hi-text text-center">
        <span className="block text-white text-sm md:text-lg uppercase font-thin tracking-[4px] md:tracking-[6px] transition-all duration-200 ease-in-out opacity-100 relative mb-2 md:mb-4">
          CỐ GẮNG HƠN, MẠNH MẼ HƠN
        </span>
        <h1 className="text-white text-lg md:text-[40px] lg:text-[60px] font-bold uppercase leading-tight md:leading-[70px] lg:leading-[90px] transition-all duration-400 ease-in-out opacity-100 relative mb-6 md:mb-8 lg:mb-10">
        CHÀO MỪNG ĐẾN VỚI FITCLUB
</h1>

        <button
          onClick={scrollToRegistrationForm}
          className="primary-btn inline-block bg-[#f36100] text-center text-white py-2 px-4 md:px-6 rounded-full transition-all duration-600 ease-in-out opacity-100"
        >
          Nhận tư vấn
        </button>
      </div>
    </div>
  </div>
</div>

    </section>
  );
};

export default HeroSection;
