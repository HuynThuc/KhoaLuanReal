// ExploreSection.jsx
import React from 'react';
import 'remixicon/fonts/remixicon.css'; // Đảm bảo rằng bạn đã nhập biểu tượng

const ExploreSection = () => {
  // Dữ liệu cho ExploreCard
  const exploreData = [
    {
      icon: "ri-boxing-fill",
      title: "Sức mạnh",
      description: "Khám phá bản chất của sức mạnh qua các khía cạnh: thể chất, tinh thần và cảm xúc."
    },
    {
      icon: "ri-heart-pulse-fill",
      title: "Thể lực",
      description: "Bao gồm các hoạt động cải thiện sức khỏe, sức mạnh, sự linh hoạt và tổng thể thể chất."
    },
    {
      icon: "ri-run-line",
      title: "Giảm mỡ",
      description: "Thông qua các bài tập và sự hướng dẫn chuyên môn, chúng tôi sẽ giúp bạn đạt được mục tiêu của mình."
    },
    {
      icon: "ri-shopping-basket-fill",
      title: "Tăng cân",
      description: "Chương trình được thiết kế cho cá nhân, cung cấp phương pháp hiệu quả để tăng cân bền vững."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-semibold">KHÁM PHÁ CHƯƠNG TRÌNH CỦA CHÚNG TÔI</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {exploreData.map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition duration-300"
          >
              <span className="text-3xl text-[#f36100] mb-4 inline-block">
              <i className={item.icon}></i>
            </span>
            <h4 className="mb-2 text-xl font-semibold text-white">{item.title}</h4>
            <p className="mb-4 text-gray-300">{item.description}</p>
            <div className="flex justify-between items-end h-6"> {/* Chiều cao cố định cho khung chứa */}
              <a className="text-white hover:text-secondary transition duration-300" href="#">
                Join Now <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreSection;
