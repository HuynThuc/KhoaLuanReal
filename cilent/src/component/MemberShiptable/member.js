import React from 'react';

const MembershipTable = () => {
  return (
    <div className="min-h-screen py-12 bg-black bg-opacity-80 text-white font-sans relative">
      <div className="absolute inset-0 z-0">
        <img src="/images/phonggym.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      </div>
      <div className="max-w-5xl mx-auto my-8 relative z-10">
        <h2 className="text-2xl font-bold text-center bg-gray-800 py-3 rounded-t-lg">
          So sánh quyền lợi các gói hội viên
        </h2>
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-b-lg shadow-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3 pl-7 text-left w-1/3 border-r border-gray-600">Hạng thành viên</th>
                <th className="p-3 text-center w-1/5 border-r border-gray-600">CLASSIC</th>
                <th className="p-3 text-center w-1/5 text-gray-300 border-r border-gray-600">PREMIUM</th>
                <th className="p-3 text-center w-1/5 text-yellow-300">VIP</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#2a2a2a]">
                <td colSpan="4" className="p-3 pl-7 font-semibold">Đặc quyền hội viên</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Vị trí tập luyện</td>
                <td className="p-3 text-center border-r border-gray-600">1 CLB đã chọn</td>
                <td className="p-3 text-center border-r border-gray-600">1 CLB đã chọn</td>
                <td className="p-3 text-center">Toàn bộ hệ thống</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Không giới hạn thời gian tập luyện</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Tham gia tất cả bộ môn: (Gym, Yoga, Kickfit, Group-X)</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Được dẫn theo 1 người đi tập cùng</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600">Cố định</td>
                <td className="p-3 text-center">Linh hoạt</td>
              </tr>
              <tr className="bg-[#2a2a2a]">
                <td colSpan="4" className="p-3 font-semibold">Nâng cấp trải nghiệm</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Định hướng tập luyện chuyên sâu cùng HLV</td>
                <td className="p-3 text-center border-r border-gray-600">2 buổi</td>
                <td className="p-3 text-center border-r border-gray-600">1 buổi</td>
                <td className="p-3 text-center">1 buổi</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Giãn cơ chuyên sâu</td>
                <td className="p-3 text-center border-r border-gray-600">1 buổi</td>
                <td className="p-3 text-center border-r border-gray-600">2 buổi</td>
                <td className="p-3 text-center">2 buổi</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Tập cùng HLV</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600">2 buổi</td>
                <td className="p-3 text-center">5 buổi</td>
              </tr>
              <tr className="bg-[#2a2a2a]">
                <td colSpan="4" className="p-3 font-semibold">Tiện ích VIP</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Locker, Xông hơi khô, nước uống</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Khăn tắm, khăn tập</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Miễn phí gửi xe<br /><span className="text-xs text-gray-400">*Áp dụng tại một số chi nhánh</span></td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600">✔️</td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Bộ quà tặng VIP</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Nước suối, nước khoáng</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Hồ bơi cao cấp</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center">✔️</td>
              </tr>
              <tr className="border-gray-700">
                <td className="p-3 pl-7 border-r border-gray-600">Ưu tiên đặt chỗ các lớp trước 48h</td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center border-r border-gray-600"></td>
                <td className="p-3 text-center">✔️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembershipTable;
