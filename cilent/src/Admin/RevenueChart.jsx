import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { DatePicker, Select, Card, Statistic } from 'antd';
import axios from 'axios';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Đăng ký thêm ArcElement cho Pie chart
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
);

const RevenueChart = () => {
    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [{
            label: 'Doanh thu',
            data: [],
            backgroundColor: 'rgb(147, 197, 253)',
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 60,
        }],
    });

    const [trainerData, setTrainerData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
        }],
    });

    const [packageData, setPackageData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
        }],
    });

    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState('monthly');
    const [dateRange, setDateRange] = useState(null);
    const [topTrainer, setTopTrainer] = useState(null);
    const [topPackage, setTopPackage] = useState(null);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const params = { period };
            if (period === 'daily' && dateRange) {
                const [startDate, endDate] = dateRange;
                params.startDate = startDate.format('YYYY-MM-DD');
                params.endDate = endDate.format('YYYY-MM-DD');
            }

            const response = await axios.get('http://localhost:3002/order/revenueStatistics', { params });

            // Set revenue bar chart data
            setRevenueData({
                labels: response.data.revenueStatistics.map(stat => stat.date),
                datasets: [{
                    label: 'Doanh thu',
                    data: response.data.revenueStatistics.map(stat => stat.revenue),
                    backgroundColor: 'rgb(147, 197, 253)',
                    borderRadius: 4,
                    borderSkipped: false,
                    barThickness: 60,
                }]
            });

            // Set trainer pie chart data
            setTrainerData({
                labels: response.data.trainerPercentage.map(trainer => trainer.name),
                datasets: [{
                    data: response.data.trainerPercentage.map(trainer => trainer.percentage),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)',
                    ],
                    borderWidth: 1,
                }],
            });

            // Set package pie chart data
            setPackageData({
                labels: response.data.gymPackagePercentage.map(pkg => pkg.name),
                datasets: [{
                    data: response.data.gymPackagePercentage.map(pkg => pkg.percentage),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 159, 64)',
                    ],
                    borderWidth: 1,
                }],
            });

            setTopTrainer(response.data.mostSelectedTrainer);
            setTopPackage(response.data.mostPopularGymPackage);
        } catch (error) {
            console.error('Lỗi khi lấy thống kê doanh thu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [period, dateRange]);

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.label}: ${context.raw.toFixed(1)}%`;
                    }
                }
            }
        }
    };

    return (
        <Card 
            title="Thống kê Doanh thu" 
            extra={
                <div className="flex items-center gap-4">
                    {period === 'daily' && (
                        <RangePicker 
                            onChange={(dates) => setDateRange(dates)}
                            className="w-64"
                        />
                    )}
                    <Select 
                        value={period} 
                        onChange={(value) => setPeriod(value)}
                        className="w-32"
                    >
                        <Option value="daily">Hàng ngày</Option>
                        <Option value="monthly">Hàng tháng</Option>
                    </Select>
                </div>
            }
        >
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    Đang tải...
                </div>
            ) : (
                <>
                    <div style={{ position: 'relative', height: '450px', width: '100%' }}>
                        <Bar 
                            data={revenueData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        backgroundColor: 'white',
                                        titleColor: '#666',
                                        bodyColor: '#666',
                                        borderColor: '#ddd',
                                        borderWidth: 1,
                                        padding: 12,
                                        displayColors: false,
                                        callbacks: {
                                            label: (context) => formatCurrency(context.raw)
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false,
                                        },
                                        border: {
                                            display: false,
                                        },
                                        ticks: {
                                            color: '#666',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    y: {
                                        border: {
                                            display: false,
                                        },
                                        grid: {
                                            color: '#f0f0f0',
                                        },
                                        beginAtZero: true,
                                        ticks: {
                                            color: '#666',
                                            font: {
                                                size: 12
                                            },
                                            callback: (value) => formatCurrency(value),
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="h-[300px]">
                            <h3 className="text-lg font-medium mb-4">Phân bố Huấn luyện viên</h3>
                            <Pie data={trainerData} options={pieOptions} />
                        </div>
                        <div className="h-[300px]">
                            <h3 className="text-lg font-medium mb-4">Phân bố Gói tập</h3>
                            <Pie data={packageData} options={pieOptions} />
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                        <Statistic 
                            title="Huấn luyện viên được chọn nhiều nhất" 
                            value={topTrainer ? topTrainer.trainer.name : 'Không có dữ liệu'} 
                        />
                        <Statistic 
                            title="Gói dịch vụ đã bán nhiều nhất" 
                            value={topPackage ? topPackage.gymPackage.name : 'Không có dữ liệu'} 
                        />
                    </div>
                </>
            )}
        </Card>
    );
};

export default RevenueChart;