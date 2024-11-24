import React from 'react';
import parse from 'html-react-parser';

export default function TrainerCard({ trainers, onSelectTrainer }) {
  return (
    <div className="flex flex-col items-center justify-center w-full text-b">
      <h2 className="text-xl font-bold mb-4">Danh sách huấn luyện viên</h2>

      <div className="flex flex-wrap gap-4">
        {trainers.map((trainer) => (
          <div 
            key={trainer.id} 
            className="relative z-20 w-80 p-2 mt-4 text-sm leading-tight text-white rounded-lg transform transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-lg py-4 shadow-[0_3px_10px_rgb(0,0,0,0.3)] hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
              <div className="photo-wrapper p-2">
                <img
                  className="w-36 h-36 rounded-full mx-auto object-cover"
                  src={`/images/${trainer.image}`}
                  alt={trainer.name}
                />
              </div>
              <div className="p-2">
                <h3 className="text-center text-xl text-gray-900 font-medium leading-8 p-3">
                  HLV: {trainer.trainerName}
                </h3>
                <div className="text-center text-gray-400 text-xs font-semibold">
                  <p>Chuyên môn: {parse(trainer.bio)}</p>
                </div>
                <div className="text-center text-gray-400 text-xs font-semibold">
                  <p>Kinh nghiệm: {trainer.experience_years} năm</p>
                </div>
                <div className="text-center my-3">
                  <button
                    className="text-xs bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600 focus:outline-none transition-colors duration-300"
                    onClick={() => onSelectTrainer(trainer.id, trainer.trainerName)}
                  >
                    Chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}