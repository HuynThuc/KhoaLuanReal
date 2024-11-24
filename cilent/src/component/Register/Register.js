import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [values, setValues] = useState({
    username: '', // đổi từ name thành username
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '', // đổi từ name thành username
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset errors
    setErrors({
      username: '', // đổi từ name thành username
      email: '',
      password: '',
      confirmPassword: '',
    });

    let isValid = true;
    const newErrors = {};

    // Validation
    if (!values.username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email || !emailPattern.test(values.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ.';
      isValid = false;
    }

    if (!values.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    }

    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Submit form if valid
      axios.post('http://localhost:3002/auth/register', values)
      .then((res) => {
        console.log(res.data); // Xem nội dung phản hồi
        const { Status, Message } = res.data;
        if (Status === 'Success') {
          navigate('/login');
        } else {
          alert(`Error: ${Message}`);
        }
      })
      .catch((err) => {
        console.error('Request failed:', err);
        alert('Có lỗi xảy ra khi gửi yêu cầu.');
      });
    
      
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Tạo tài khoản</h2>
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên đăng nhập"
              value={values.username}
              onChange={(e) => setValues({ ...values, username: e.target.value })} // Sửa thành username
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>} {/* Sửa thành username */}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email của bạn"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-gray-700 font-semibold mb-2">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Xác nhận mật khẩu"
              value={values.confirmPassword}
              onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Đã có tài khoản? <a href="/login" className="text-blue-500 font-semibold">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
