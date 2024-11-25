import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, handleGoogleLoginSuccess } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Lấy token từ cookie khi ứng dụng khởi tạo
    handleGoogleLoginSuccess();
}, []);


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
        await login(loginData.email, loginData.password);
        navigate('/');
      } catch (err) {
        console.error(err);
        setFormErrors({ email: 'Login failed. Please check your credentials.' });
      }
    }
    setIsSubmitted(true);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3002/auth/google';
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
          style={{ backgroundImage: "url('/images/hinh.jpg')" }}>
        </div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          
          {/* Google Login Button */}
          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Đăng nhập bằng google
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" className="text-xs text-center text-gray-500 uppercase">hoặc đăng nhập bằng email</a>
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
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
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;