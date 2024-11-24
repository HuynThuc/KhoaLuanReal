import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();  // Khai báo state cho dịch vụ

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch('http://localhost:3002/service/getAllServices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);  // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchService();
  }, []);

  const handleExploreClick = (serviceId) => {
    navigate(`/servicedetail/${serviceId}`);
  };

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-orange-500 text-sm uppercase tracking-wider">WHAT WE DO?</span>
          <h2 className="text-white text-4xl md:text-5xl font-bold mt-2">PUSH YOUR LIMITS FORWARD</h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {services.map((service) => (
            <div key={service.id} className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Block */}
              <div className={`relative overflow-hidden 
                ${service.layout === 'image-left' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="w-full h-full aspect-square"> {/* Đảm bảo hình vuông */}
                  <img 
                    src={`/images/${service.image}`}
                    alt={service.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Text Block */}
              <div className={`bg-[#1A1A1A] p-12 flex flex-col justify-center
                ${service.layout === 'image-left' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="space-y-4">
                  <h3 className="text-white text-2xl font-bold">{service.serviceName}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description ? service.description.slice(0, 150) + '...' : ''} {/* Cắt giảm mô tả */}
                  </p>
                  <button 
                    onClick={() => handleExploreClick(service.id)} 
                    className="text-white hover:text-orange-500 mt-4">EXPLORE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
