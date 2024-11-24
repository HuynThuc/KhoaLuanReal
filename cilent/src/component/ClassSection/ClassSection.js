// src/components/ClassSection.jsx
import React from 'react';
import class1Image from '../assets/class-1.jpg';
import class2Image from '../assets/class-2.jpg';

const ClassSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
                <div className="absolute inset-0 bg-[#f36100] opacity-50 blur-3xl"></div>
                <img src={class1Image} alt="class" className="relative z-10 left-28 top-0 rounded-[10px] max-w-full lg:max-w-[500px]" />
                <img src={class2Image} alt="class" className="absolute top-48 z-20 rounded-[10px] max-w-[350px]" />
            </div>
            <div>
                <h2 className="text-4xl font-semibold mb-6">CÁC LỚP HỌC</h2>
                <p className="mb-8 text-gray-300">
                    Được dẫn dắt bởi đội ngũ huấn luyện viên chuyên nghiệp và nhiệt huyết, 
                    "Các Lớp Tập Tại Đây" là một buổi tập năng động, tập trung vào kết quả,
                    kết hợp hoàn hảo giữa cardio, rèn luyện sức mạnh và các bài tập chức năng.
                </p>
                <button className="bg-[#f36100] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300">Đặt Lớp Ngay</button>
            </div>
        </section>
    );
};

export default ClassSection;
