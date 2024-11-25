import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


export const AuthContext = createContext();

export const setTokens = (access_token, refresh_token) => {
    localStorage.setItem('AccessToken', access_token);
    localStorage.setItem('RefreshToken', refresh_token);
};

export const fetchAccessToken = () => localStorage.getItem('AccessToken');
export const fetchRefreshToken = () => localStorage.getItem('RefreshToken');

export const clearTokens = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
};

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

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Thêm hàm để lấy token từ URL
    const getTokenFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            // Xóa token khỏi URL để bảo mật
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        return token;
    };

    const handleGoogleLoginSuccess = async () => {
        try {
            // Thứ tự ưu tiên: 
            // 1. Token từ URL (khi mới đăng nhập)
            // 2. Token từ localStorage (nếu đã lưu trước đó)
            const urlToken = getTokenFromUrl();
            const storedToken = fetchAccessToken();
            const token = urlToken || storedToken;

            if (token) {
                const decodedUser = decodeToken(token);
                if (decodedUser) {
                    // Nếu là token mới từ URL, lưu vào localStorage
                    if (urlToken) {
                        setTokens(urlToken, ''); // Không có refresh token trong trường hợp Google login
                    }
                    setUser(decodedUser);
                    console.log("User logged in:", decodedUser);
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            clearTokens();
        } finally {
            setLoading(false);
        }
    };

   const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3002/auth/login', { email, password });
        if (response.data.access_token && response.data.refresh_token) {
            const { access_token, refresh_token } = response.data;
            setTokens(access_token, refresh_token);
            const user = decodeToken(access_token);
            setUser(user);
        } else {
            throw new Error("Sai email hoặc mật khẩu.");
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;  // Dùng throw để lỗi được bắt ở component và thông báo cho người dùng
    }
};


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
                logout();
            }
        }
    };

    const logout = () => {
        clearTokens();
        setUser(null);
    };

    // Kiểm tra authentication status khi component mount
    useEffect(() => {
        handleGoogleLoginSuccess();
    }, []);

    //  Kiểm tra token trong localStorage khi component được mount
     useEffect(() => {
        const access_token = fetchAccessToken();
        if (access_token) { 
            const user = decodeToken(access_token);
            setUser(user);

            const expirationTime = user.exp * 1000 - Date.now() - 60000; // refresh trước 1 phút
            const timeout = setTimeout(refreshToken, expirationTime);
            
            return () => clearTimeout(timeout); // Xóa timeout khi unmount
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            refreshToken,
            handleGoogleLoginSuccess,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;