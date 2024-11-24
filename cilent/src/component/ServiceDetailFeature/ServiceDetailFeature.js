import React from 'react';
import muscleicon from '../assets/muscleicon.png';
import kneecap from '../assets/kneecap.png';
import muscleicon1 from '../assets/muscleicon1.png'
import heart from '../assets/favour.png'
import parse from 'html-react-parser';

const ServiceDetailFeature = ({ content }) => {
  return (
    <section className="bg-white ">
      <div className="container mx-auto">
        <div className="container mx-auto py-8 px-60 bg-white text-black">
          <h2 className="text-3xl font-semibold mb-4 text-center">Mô tả dịch vụ</h2>
          <div className="text-lg leading-relaxed">
            {content ? parse(content) : "Đang tải..."}
          </div>
        </div>
        <div className="text-center mb-12 text-black">
          <h3 className="text-3xl font-semibold pb-3">Lợi ích khóa học
          </h3>
          <div className="sub-description mx-auto max-w-2xl">
            Khác với tập một mình, huấn luyện viên sẽ giúp bạn mang lại những kết quả tối ưu nhất cho các mục tiêu hình thể cá nhân, đảm bảo những giờ tập luyện thể thao an toàn, đúng cách và hiệu quả. Ngoài ra huấn luyện viên còn gợi ý chế độ ăn uống kết hợp với tập luyện dựa theo mục tiêu khách hàng để khách hàng đạt kết quả nhanh nhất.
          </div>
        </div>

        {/* Các mục với icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1"> {/* Giảm khoảng cách giữa các mục */}

          {/* Mục 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="icon mb-4">
              <img src={muscleicon} alt="Muscle icon" className="w-32 h-32" /> {/* Tăng kích thước icon */}
            </div>
            <div className="title text-xl font-semibold mb-2 text-black">Tăng cường sức mạnh</div>
          </div>

          {/* Mục 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="icon mb-4">
              <img src={kneecap} alt="Kneecap icon" className="w-32 h-32" /> {/* Tăng kích thước icon */}
            </div>
            <div className="title text-xl font-semibold mb-2 text-black">Cơ thể vững chãi</div>
          </div>

          {/* Mục 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="icon mb-4">
              <img src={muscleicon1} alt="Muscle icon 1" className="w-32 h-32" /> {/* Tăng kích thước icon */}
            </div>
            <div className="title text-xl font-semibold mb-2 text-black">Cơ thể dẻo dai</div>
          </div>

          {/* Mục 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="icon mb-4">
              <img src={heart} alt="Heart icon" className="w-32 h-32" /> {/* Tăng kích thước icon */}
            </div>
            <div className="title text-xl font-semibold mb-2 text-black">Tốt cho tim mạch</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailFeature;
