import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import AuthContext from '../../Context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setUserMenuOpen(false); // Đóng menu sau khi điều hướng
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log('User', user);
  
  return (
    <header className={`fixed left-0 top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-custom' : 'bg-transparent'}`}>
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <div className="nav__logo max-w-[150px] ">
          <a href="/"><img src={logo} alt="Logo" /></a>
        </div>
        <ul className="nav__links list-none text-white text-gray-900 flex items-center gap-12">
          <li className="link"><a href="#" className="hover:text-gray-700">TRANG CHỦ</a></li>
          <li className="link"><a href="/service" className="hover:text-gray-700">DỊCH VỤ</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">LỚP HỌC</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">ABOUT</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">KHUYẾN MÃI</a></li>
        </ul>
        {user ? (
          <div className="relative">
            <button onClick={handleUserClick} className="flex items-center">
              <i className="fa fa-user text-gray-900 text-lg"></i>
            </button>
            {userMenuOpen && (
              <div className="absolute top-[60px] right-0 w-[170px] bg-white border rounded shadow-xl z-50">
                <div className="user-menu-container p-2">
                  <p>Welcome, {user.username}!</p>
                  <ul className="user-menu-list">
                    <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={() => handleNavigation('/account')}>
                      Tài khoản của tôi
                    </li>
                    <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={() => handleNavigation('/profile')}>
                      Lịch của tôi
                    </li>
                    {/* Kiểm tra roleId của user */}
                    {user.roleId === 1 && (
                      <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={() => handleNavigation('/admin-2')}>
                        Admin
                      </li>
                    )}
                    <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={logout}>
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn bg-blue-600 text-white py-2 px-6 rounded hover:bg-orange-600">
            <Link to="/login">THAM GIA NGAY</Link>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
