// src/components/HeroSection.jsx
import React from 'react';
import hero from '../assets/hero-1.jpg';

const HeroSection = () => {
  const scrollToRegistrationForm = () => {
    const registrationSection = document.getElementById('registration-form');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hs-slider owl-carousel">
        <div
          className="hs-item flex items-center justify-center h-[1040px] pt-[355px] bg-cover"
          style={{ backgroundImage: `url(${hero})` }}
        >
          <div className="container ml-auto mr-[280px] h-full w-full">
            <div className="flex items-center">
              <div className="hi-text ml-auto">
                <span className="block text-white text-lg uppercase font-thin tracking-[6px] transition-all duration-200 ease-in-out opacity-100 relative mb-4">
                  Định hình cơ thể bạn
                </span>
                <h1 className="text-white text-[80px] font-bold uppercase leading-[90px] transition-all duration-400 ease-in-out opacity-100 relative mb-10">
                  Trở nên <strong className="text-[#f36100]">mạnh mẽ</strong>
                  <br />
                  Tập luyện chăm chỉ
                </h1>
                <button
                  onClick={scrollToRegistrationForm} // Sự kiện onClick để điều hướng
                  className="primary-btn inline-block bg-[#f36100] text-center  text-white py-2 px-6 rounded-full transition-all duration-600 ease-in-out opacity-100"
                >
                  Nhận tư vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
