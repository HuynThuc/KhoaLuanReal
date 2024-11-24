import React from 'react';

const RegistrationForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <section id="registration-form" className="registration-form">
            <div className="py-24 w-full bg-white flex items-center justify-center">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-6">
                        {/* Left column - Text content */}
                        <div className="w-full md:w-1/2 max-w-xl ml-16">
                            <h1 className="text-4xl font-bold mb-4 text-black">TRẢI NGHIỆM NGAY!</h1>
                            <p className="text-gray-600">
                                Hãy thử điều gì đó mới mẻ trong năm nay bằng cách tham gia thế giới trải nghiệm thú vị và vui nhộn từ chúng tôi. Chúng tôi cung cấp DÙNG THỬ MIỄN PHÍ 7 ngày cho tất cả khách mới. Để lại thông tin của bạn bên cạnh và chúng tôi sẽ liên hệ với bạn trong 24 giờ tới.
                            </p>
                        </div>

                        {/* Right column - Form */}
                        <div className="w-full md:w-1/2">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-xl text-black ml-10">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Họ và Tên *"
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-red-500 bg-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại *"
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-red-500 bg-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-red-500 bg-transparent"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-red-600 text-white px-8 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                    ĐĂNG KÝ TƯ VẤN
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    );
};

export default RegistrationForm;