import React, { useState } from 'react';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [weightStatus, setWeightStatus] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmiResult(bmi);

    if (bmi < 18.5) setWeightStatus('Thiếu cân');
    else if (bmi >= 18.5 && bmi <= 24.9) setWeightStatus('Bình thường');
    else if (bmi >= 25 && bmi <= 29.9) setWeightStatus('Thừa cân');
    else setWeightStatus('Béo phì');
  };

  return (
    <div className=" relative bg-custom text-white py-28">
      {/* Background Image */}
      <div 
    className="absolute inset-0 z-0 opacity-50" 
    style={{
      backgroundImage: "url('/images/bmi.jpg')", // Thay đổi đường dẫn ở đây
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
      
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Column */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">TÍNH CHỈ SỐ BMI CỦA BẠN</h1>
          <p className="text-gray-300 mb-6">
            Chỉ số khối cơ thể hay còn gọi là BMI được dùng để xác định mức độ gầy hay béo của cơ thể
            thông qua chiều cao và cân nặng. Để có thể xác định được chỉ số BMI của bạn, vui lòng trả lời
            những câu hỏi dưới đây:
          </p>

          <form onSubmit={calculateBMI} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Cân nặng (kg)</label>
                <input
                
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  
                  className="w-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Chiều cao (cm)</label>
                <input
                 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                 
                  className="w-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              XEM KẾT QUẢ
            </button>
          </form>

          {bmiResult && (
            <p className="mt-6 text-lg">
              Chỉ số BMI của bạn là: {bmiResult}, trạng thái: {weightStatus}
            </p>
          )}
        </div>

        {/* Right Column - BMI Table */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-orange-500 rounded-lg overflow-hidden max-w-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">Chỉ số BMI</th>
                  <th className="px-6 py-3 text-left">Phân loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-400">
                <tr>
                  <td className="px-6 py-3">Dưới 18.5</td>
                  <td className="px-6 py-3">Thiếu cân</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">18.5 - 24.9</td>
                  <td className="px-6 py-3">Bình thường</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">25 - 29.9</td>
                  <td className="px-6 py-3">Thừa cân</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">Trên 30</td>
                  <td className="px-6 py-3">Béo phì</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;