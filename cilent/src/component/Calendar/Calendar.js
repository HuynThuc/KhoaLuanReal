import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Xử lý khi click nút tháng trước
  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  // Xử lý khi click nút tháng sau
  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  // Lấy số ngày trong tháng hiện tại
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Tạo mảng chứa ngày cần hiển thị
  const generateDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());

    // Thêm các ngày của tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Thêm các ngày của tháng trước
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay() || 7; // Chuyển đổi Chủ Nhật (0) thành 7
    const lastMonthDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    for (let i = firstDayWeekday - 1; i > 0; i--) {
      days.unshift(lastMonthDays - i + 1); // Ngày của tháng trước
    }

    // Thêm các ngày của tháng sau (để hoàn thành tuần)
    while (days.length % 7 !== 0) {
      days.push(days.length - daysInMonth); // Ngày của tháng sau
    }

    return days;
  };

  const daysToDisplay = generateDays();

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow p-4 text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="flex items-center gap-1 text-blue-600">
          <ChevronLeft className="w-5 h-5" />
          THÁNG TRƯỚC
        </button>

        <h2 className="text-xl font-semibold">
          {date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
        </h2>

        <button onClick={nextMonth} className="flex items-center gap-1 text-blue-600">
          THÁNG SAU
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Header các ngày trong tuần */}
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}

        {/* Hiển thị các ngày */}
        {daysToDisplay.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 cursor-pointer transition-colors duration-200 ease-in-out 
              ${selectedDate === day ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-200'}`}
            onClick={() => setSelectedDate(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
