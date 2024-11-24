import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // Import hook từ AuthProvider

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [loginData, isSubmitted]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let valid = validateForm();

    if (valid) {
      try {
        await login(loginData.email, loginData.password); // Gọi hàm login từ AuthContext
        navigate('/'); // Navigate to the home page
      } catch (err) {
        console.error(err);
        // Handle error (e.g., show error message)
        setFormErrors({ email: 'Login failed. Please check your credentials.' }); // Hiển thị thông báo lỗi
      }
    }
    setIsSubmitted(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    if (!loginData.email) {
      errors.email = "Please enter email";
    } else {
      const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(loginData.email);
      if (!validEmail) {
        errors.email = "Email is not valid";
      }
    }

    if (!loginData.password) {
      errors.password = "Please enter password";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }

    return isValid;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover"
          style={{ backgroundImage: "url('https://truongthang.vn/wp-content/uploads/2023/08/goi-y-noi-that-phong-khach-rong-cho-nha-them-sang-va-dep-3.jpg')" }}>
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">Brand</h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" className="text-xs text-center text-gray-500 uppercase">or login with email</a>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={onSubmit} className="mt-6">
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 block w-full"
                type="email"
                name="email"
                value={loginData.email}
                onChange={onChange}
                required
              />
              {formErrors.email && <p className="text-red-500 text-xs italic">{formErrors.email}</p>}
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 block w-full"
                type="password"
                name="password"
                value={loginData.password}
                onChange={onChange}
                required
              />
              {formErrors.password && <p className="text-red-500 text-xs italic">{formErrors.password}</p>}
            </div>

            <div className="mt-6">
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-400 w-full"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
