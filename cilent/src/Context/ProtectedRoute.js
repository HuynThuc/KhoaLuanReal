// src/component/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    // Kiểm tra xem người dùng có roleId = 1 hay không
    if (!user || user.roleId !== requiredRole) {
        console.log('Không có quyền truy cập hoặc chưa đăng nhập');
        return <Navigate to="/login" />; // Nếu không, chuyển hướng về trang đăng nhập
    }

    // Nếu hợp lệ, render các children component
    return children;
}; // Nếu không, chuyển hướng về trang đăng nhập


export default ProtectedRoute;
