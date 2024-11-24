import React from 'react';
import joinImage from '../assets/join.jpg';

const JoinSection = () => {
  const joinData = [
    { icon: "ri-user-star-fill", title: "Huấn Luyện Viên Cá Nhân", description: "Khơi dậy tiềm năng của bạn với các Huấn Luyện Viên Cá Nhân chuyên nghiệp." },
    { icon: "ri-vidicon-fill", title: "Buổi Tập Luyện", description: "Nâng cao thể lực của bạn qua các buổi tập luyện." },
    { icon: "ri-building-line", title: "Quản Lý Tốt", description: "Quản lý tận tâm, hỗ trợ sự thành công trong hành trình thể hình của bạn." }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-semibold text-center mb-4">TẠI SAO CHỌN CHÚNG TÔI?</h2>
      <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
        Cộng đồng thành viên đa dạng của chúng tôi tạo nên một môi trường thân thiện và hỗ trợ, nơi bạn có thể kết bạn và duy trì động lực.
      </p>
      <div className="relative">
        <img src={joinImage} alt="Join" className="w-full rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 mx-16 p-8 rounded-lg transform translate-y-1/2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {joinData.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="text-3xl text-[#f36100]"><i className={item.icon}></i></span>
                <div>
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
