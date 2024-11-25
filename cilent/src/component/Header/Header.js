import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import logo from '../assets/logo.png';
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setUserMenuOpen(false);
    setIsMobileMenuOpen(false);
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

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`fixed left-0 top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-custom' : 'bg-transparent'}`}>
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="nav__logo max-w-[150px]">
        <a href="/"><img src={logo} alt="Logo" /></a>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav__links hidden md:flex list-none text-white text-gray-900 items-center gap-12">
          <li className="link"><a href="#" className="hover:text-gray-700">TRANG CHỦ</a></li>
          <li className="link"><a href="/service" className="hover:text-gray-700">DỊCH VỤ</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">LỚP HỌC</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">ABOUT</a></li>
          <li className="link"><a href="#" className="hover:text-gray-700">KHUYẾN MÃI</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={handleMobileMenuClick}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
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
            <button className="btn bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600">
              <Link to="/login">THAM GIA NGAY</Link>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-40 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="flex justify-end">
            <button 
              onClick={handleMobileMenuClick}
              className="text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu Links */}
          <ul className="mt-8 space-y-4">
            <li><a href="#" className="block text-gray-900 hover:text-gray-700">TRANG CHỦ</a></li>
            <li><a href="/service" className="block text-gray-900 hover:text-gray-700">DỊCH VỤ</a></li>
            <li><a href="#" className="block text-gray-900 hover:text-gray-700">LỚP HỌC</a></li>
            <li><a href="#" className="block text-gray-900 hover:text-gray-700">ABOUT</a></li>
            <li><a href="#" className="block text-gray-900 hover:text-gray-700">KHUYẾN MÃI</a></li>
          </ul>

          {/* Mobile User Menu */}
          <div className="mt-8">
            {user ? (
              <div className="space-y-4">
                <p className="text-gray-900">Welcome, {user.username}!</p>
                <ul className="space-y-2">
                  <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={() => handleNavigation('/account')}>
                    Tài khoản của tôi
                  </li>
                  <li className="transition-colors duration-200 block p-2 text-normal text-gray-900 rounded hover:bg-purple-500 hover:text-white" onClick={() => handleNavigation('/profile')}>
                    Lịch của tôi
                  </li>
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
            ) : (
              <button className="w-full btn bg-blue-600 text-white py-2 px-6 rounded hover:bg-orange-600">
                <Link to="/login">THAM GIA NGAY</Link>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleMobileMenuClick}
        ></div>
      )}
    </header>
  );
};

export default Header;