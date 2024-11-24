import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Tạo AuthContext
export const AuthContext = createContext();

// Hàm lưu token vào localStorage
export const setTokens = (access_token, refresh_token) => {
    localStorage.setItem('AccessToken', access_token);
    localStorage.setItem('RefreshToken', refresh_token);
};

// Hàm lấy token từ localStorage
export const fetchAccessToken = () => localStorage.getItem('AccessToken');
export const fetchRefreshToken = () => localStorage.getItem('RefreshToken');

// Hàm xóa token khỏi localStorage khi đăng xuất
export const clearTokens = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
};

// Hàm giải mã token
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Hook sử dụng AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3002/auth/login', { email, password });
            if (response.data.access_token && response.data.refresh_token) {
                const { access_token, refresh_token } = response.data;
                setTokens(access_token, refresh_token);
    
                const user = decodeToken(access_token);
                setUser(user);
            } else {
                throw new Error('Login failed: no tokens returned');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed: ' + error.message); // Ghi lại thông báo lỗi
        }
    };
    

    // Hàm refresh token
    const refreshToken = async () => {
        const refresh_token = fetchRefreshToken();
        if (refresh_token) {
            try {
                const response = await axios.post('http://localhost:3002/auth/refresh-token', { refresh_token });
                const { access_token, refresh_token: newRefreshToken } = response.data;
                setTokens(access_token, newRefreshToken);

                const user = decodeToken(access_token);
                setUser(user);
            } catch (error) {
                console.error('Refresh token error:', error);
                logout(); // Đăng xuất nếu refresh token không hợp lệ
            }
        }
    };

    // Hàm logout
    const logout = () => {
        clearTokens();
        setUser(null);
    };

    // Kiểm tra token trong localStorage khi component được mount
    useEffect(() => {
        const access_token = fetchAccessToken();
        if (access_token) {
            const user = decodeToken(access_token);
            setUser(user);

            const expirationTime = user.exp * 1000 - Date.now() - 60000; // refresh trước 1 phút
            const timeout = setTimeout(refreshToken, expirationTime);
            
            return () => clearTimeout(timeout); // Xóa timeout khi unmount
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
