import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Mail, Phone, Trophy, User } from 'lucide-react';
import AuthContext from '../../Context/AuthContext';

const GymProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useContext(AuthContext);
    const [orderDetails, setOrderDetails] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        console.log("Current user:", user);
    }, [user]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (user && user.id) {
                try {
                    const response = await fetch(`http://localhost:3002/order/getOrderDetailsByUser/${user.id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setOrderDetails(data.orderDetails || []);
    
                    // Tính toán dữ liệu stats từ orderDetails
                    const totalSessions = data.orderDetails.length;
                    const completedSessions = data.orderDetails.filter(order => order.status === 'completed').length;
                    const canceledSessions = data.orderDetails.filter(order => order.status === 'canceled').length;
    
                    // Số buổi còn lại bao gồm cả buổi bị hủy
                    const remainingSessions = totalSessions - completedSessions - canceledSessions;
                    const totalHours = completedSessions * 1; // Giả sử mỗi buổi tập là 1 giờ, bạn có thể điều chỉnh logic này.
    
                    const completionRate = totalSessions > 0
                        ? `${Math.round((completedSessions / totalSessions) * 100)}%`
                        : '0%';
    
                    // Cập nhật giá trị stats
                    setStats([
                        { value: remainingSessions.toString(), label: "Buổi tập còn lại" },
                        { value: completedSessions.toString(), label: "Tổng buổi đã tập" },
                        { value: completionRate, label: "Tỷ lệ hoàn thành" },
                        { value: totalHours.toString(), label: "Giờ tập" }
                    ]);
    
                } catch (error) {
                    console.error("Error fetching order details:", error);
                }
            }
        };
        fetchOrder();
    }, [user]);
    

    console.log('Order details:', orderDetails);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto pt-36 pb-10">
                {/* Profile Header */}
                {user ? (
                    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm flex items-center gap-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-2xl font-bold mb-2">{user.username}</div>
                            <div className="text-gray-500 flex gap-6">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {user.phone}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Đang tải thông tin người dùng...</div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg p-1 mb-6 flex gap-0.5">
                    {['overview', 'schedule', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-6 rounded-md font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                        >
                            {tab === 'overview' && 'Tổng quan'}
                            {tab === 'schedule' && 'Lịch tập'}
                            {tab === 'settings' && 'Cài đặt'}
                        </button>
                    ))}
                </div>

                {/* Tab Contents */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-gray-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col items-center p-5 text-center">
                                <div className="border-2 border-gray-200 p-4 rounded-lg mb-3">
                                    {/* QR Code placeholder */}
                                    <div className="w-48 h-48 bg-gray-100"></div>
                                </div>
                                <div className="text-lg font-medium text-blue-800">
                                    Mã thành viên của bạn
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div>
                        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-semibold mb-4">Đặt lịch tập</h2>
                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700">
                                Đặt lịch
                            </button>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Lịch đã đặt</h2>
                            <div className="divide-y">
                                {orderDetails.map((order, index) => (
                                    <div key={index} className="py-4 flex justify-between items-center">
                                        <div>{order.sessionDate} - {order.sessionTime} - HLV: {order.trainer.trainerName} - Gói tập - {order.gymPackage.name} </div>
                                        <span className={`px-3 py-1 rounded-md text-sm 
    ${order.status === 'completed' ? 'bg-green-100 text-green-800'
                                                : order.status === 'canceled' ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'}`}>
                                            {order.status === 'completed' ? 'Đã hoàn thành'
                                                : order.status === 'canceled' ? 'Đã hủy'
                                                    : 'Chưa sử dụng'}
                                        </span>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Cài đặt tài khoản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Họ tên</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-200 rounded-md"
                                    defaultValue={user.username}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-200 rounded-md"
                                    defaultValue={user.email}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className="w-full p-2 border border-gray-200 rounded-md"
                                    defaultValue={user.phone}
                                />
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700">
                                Cập nhật thông tin
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymProfile;
