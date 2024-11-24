import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment-timezone';
import AuthContext from '../../Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-toastify/dist/ReactToastify.css';
import { CreditCard, Smartphone, Mail, User, Clock, Calendar, Tag, CheckCircle } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const { selectedSlots } = location.state || {};
  const price = location.state?.price;
  const planId = location.state?.planId;
  const trainerId = location.state?.trainerId;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreeToTerms: false,
    subscribeToPromotions: false,
    discountCode: '', // Thêm trường discountCode vào formData
  });

  const [finalPrice, setFinalPrice] = useState(price);
  const [originalPrice, setOriginalPrice] = useState(price);
  const [discountMessage, setDiscountMessage] = useState('');
  const [appliedCode, setAppliedCode] = useState(null);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cập nhật formData với thông tin user từ AuthContext khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Nhấn áp dụng khuyến mãi
  const handleApplyDiscount = async () => {
    if (appliedCode === formData.discountCode) {
      setDiscountMessage('Mã giảm giá này đã được áp dụng!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/promotion/validate/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.discountCode // Gửi mã giảm giá
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const promotion = await response.json();
      if (promotion.message === 'Mã giảm giá hợp lệ') {
        const discountedPrice = (originalPrice * (100 - promotion.promotion.discountPercent)) / 100;
        setFinalPrice(discountedPrice);
        setDiscountMessage('Mã giảm giá đã được áp dụng!');
        setAppliedCode({ code: formData.discountCode, id: promotion.promotion.id });
        setIsDiscountApplied(true); // Đánh dấu mã đã áp dụng
        console.log("ID của mã giảm giá:", promotion.promotion.id);
      } else {
        setDiscountMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };






  // Thêm hàm handleMomoPayment vào component BookingConfirmation
  const handleMomoPayment = async () => {
    try {
      const sessionDate = selectedSlots && selectedSlots.length > 0
        ? moment(selectedSlots[0].date).format('YYYY-MM-DD')
        : null;

      // Tạo danh sách các session với ngày và giờ tương ứng
      const orderDetails = selectedSlots.map(slot => ({
        gymPackageId: planId,
        trainerId,
        price: finalPrice,
        sessionDate: moment(slot.date).format('YYYY-MM-DD'), // Ngày cho từng giờ
        sessionTime: slot.hour, // Giờ cho từng slot
        promotionId: appliedCode?.id
      }));

      const requestData = {
        userId: user.id,
        totalAmount: finalPrice,
        status: 'pending',
        orderDetails: orderDetails // Sử dụng danh sách chi tiết đơn hàng đã tạo
      };

      setLoading(true); // Bắt đầu tải dữ liệu
      // Gọi API tạo thanh toán MoMo
      const response = await fetch('http://localhost:3002/payment/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setLoading(false); // Bắt đầu tải dữ liệu

      // Chuyển hướng người dùng đến URL thanh toán của MoMo
      if (result.data && result.data.payUrl) {
        window.location.href = result.data.payUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán từ MoMo');
      }

    } catch (error) {
      console.error("Error creating MoMo payment:", error);
      alert('Đã xảy ra lỗi trong quá trình tạo thanh toán MoMo.');
    }
  };

  // Hàm kiểm tra giờ đã được đặt
  const checkAvailableSlots = async (trainerId, date, selectedSlots) => {
    try {
      const bookedResponse = await fetch(`http://localhost:3002/order/getOrderdetailbyTrainer/${trainerId}`);
      const bookedData = await bookedResponse.json();

      const bookedSlots = bookedData.orderDetails || [];

      // Kiểm tra từng slot đã chọn xem có bị trùng không
      for (const slot of selectedSlots) {
        const isBooked = bookedSlots.some(bookedSlot => {
          return bookedSlot.sessionDate === date && bookedSlot.sessionTime.includes(slot.hour);
        });
        if (isBooked) {
          return false; // Có ít nhất một slot đã được đặt
        }
      }

      return true; // Tất cả các slot đều có sẵn
    } catch (error) {
      console.error('Error checking available slots:', error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.agreeToTerms || !trainerId || !planId) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!formData.paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!selectedSlots || selectedSlots.length === 0) {
      toast.error('Vui lòng chọn ngày và giờ tập!');
      return;
    }

    setIsProcessing(true);

    try {
      // Lấy ngày từ slot đầu tiên
      const sessionDate = moment(selectedSlots[0].date).format('YYYY-MM-DD');

      // Kiểm tra xem giờ đã được đặt chưa
      const isAvailable = await checkAvailableSlots(trainerId, sessionDate, selectedSlots);

      if (!isAvailable) {
        toast.error('Giờ không còn trống. Vui lòng chọn giờ khác.');
        return;
      }

      if (formData.paymentMethod === 'momo') {
        await handleMomoPayment();
      } else {
        // Tạo danh sách các buổi tập với ngày và giờ tương ứng
        const orderDetails = selectedSlots.map(slot => ({
          gymPackageId: planId,
          trainerId: trainerId,
          price: finalPrice,
          sessionDate: moment(slot.date).format('YYYY-MM-DD'), // Ngày cho từng giờ
          sessionTime: slot.hour, // Giờ cho từng slot
          promotionId: appliedCode ? appliedCode.id : null
        }));

        // Xử lý thanh toán tiền mặt
        const requestData = {
          userId: user.id,
          totalAmount: finalPrice,
          status: 'pending',
          orderDetails: orderDetails // Sử dụng danh sách chi tiết đơn hàng đã tạo
        };

        setLoading(true); // Bắt đầu tải dữ liệu

        const response = await fetch('http://localhost:3002/order/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setLoading(false); // Kết thúc tải dữ liệu

        navigate('/thank');

        // Reset form data
        setFinalPrice(price);
        setOriginalPrice(price);
        setAppliedCode(null);
        setIsDiscountApplied(false);
        setFormData(prev => ({
          ...prev,
          discountCode: ''
        }));
        setDiscountMessage('');
      }
    } catch (error) {
      console.error("Error processing order:", error);
      alert('Đã xảy ra lỗi trong quá trình xử lý đơn hàng.');
    } finally {
      setIsProcessing(false);
    }
  };






  return (

    <div className="max-w-4xl mx-auto mt-10 p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        XÁC NHẬN THÔNG TIN
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <User className="w-5 h-5 mr-2 text-gray-600" />
              Họ và tên <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nhập họ tên của bạn"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Mail className="w-5 h-5 mr-2 text-gray-600" />
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập địa chỉ email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Smartphone className="w-5 h-5 mr-2 text-gray-600" />
              Số điện thoại <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex">
              <select className="p-3 border border-gray-300 rounded-l-lg bg-white">
                <option value="+84">🇻🇳 +84</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                className="flex-1 p-3 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
              Phương thức thanh toán
            </h3>
            <div className="space-y-2">

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  className="mr-3"
                  onChange={handleChange}
                />
                <span>Thanh toán tiền mặt</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  className="mr-3"
                  onChange={handleChange}
                />
                <span>Thanh toán qua MoMo</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column - Booking Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Thông tin đặt chỗ</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-600">Thời gian:</span>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-600">Thời gian:</span>
              </div>

              <div className="flex flex-col mt-2 space-y-2"> {/* Tạo các dòng ngày-giờ */}
                {selectedSlots && selectedSlots.length > 0 ? (
                  selectedSlots.map((slot, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-1">
                        <span className="text-gray-600 font-semibold">Ngày:</span>
                        <span className="font-medium pl-2">{moment(slot.date).format('DD/MM/YYYY')}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-600 font-semibold">Giờ:</span>
                        <span className="font-medium pl-2">{slot.hour}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">Chưa chọn giờ</div>
                )}
              </div>



              <div className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-gray-600">Giá:</span>
                {isDiscountApplied && (
                  <span className="line-through pl-2 text-gray-400">
                    {Number(originalPrice).toLocaleString('vi-VN', { style: 'decimal' })}đ
                  </span>
                )}
                <span className="font-medium pl-2 text-lg text-blue-600">
                  {Number(finalPrice).toLocaleString('vi-VN', { style: 'decimal' })}đ
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center text-gray-700 font-medium">
              <Tag className="w-5 h-5 mr-2 text-gray-600" />
              Mã giảm giá
            </label>
            <div className="flex">
              <input
                type="text"
                name="discountCode"
                placeholder="Nhập mã giảm giá"
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={formData.discountCode}
                onChange={handleChange}
              />
              <button
                onClick={handleApplyDiscount}
                className="px-6 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-200"
              >
                Áp dụng
              </button>
            </div>
            {discountMessage && (
              <div className="text-red-500 text-sm">
                {discountMessage}
              </div>
            )}
          </div>


          <div className="flex flex-col items-start mb-4 space-y-4">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                className="mt-1"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span className="text-sm">
               Đồng ý với các điều khoản
                <span className="text-red-500">*</span>
              </span>
            </label>

            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="subscribeToPromotions"
                className="mt-1"
                checked={formData.subscribeToPromotions}
                onChange={handleChange}
              />
              <span className="text-sm">
                Đăng kí nhận thông tin
              </span>
            </label>
          </div>

          <div className="text-red-500 text-sm">
            {!formData.agreeToTerms && "Value is required and cannot be empty"}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full p-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition duration-300 flex items-center justify-center space-x-2"
          >

            {loading ? (
              <FontAwesomeIcon className="w-5 h-5" icon={faSpinner} spin size="1x" />
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Xác nhận đặt lịch
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
      />
    </div>

  );
};

export default BookingConfirmation;

