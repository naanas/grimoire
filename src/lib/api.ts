import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// Request Logger & Auth Token
api.interceptors.request.use(request => {
    // Only log URL and Method to avoid leaking PII (passwords) in Console
    console.log('🚀 [API] Request:', request.method?.toUpperCase(), request.url);

    // Attach Token if exists
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
    }

    return request;
});

// Response Logger
api.interceptors.response.use(
    response => {
        console.log('✅ [API] Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('❌ [API] Error:', error.response?.status, error.message);
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            if (!localStorage.getItem('is_logging_out')) {
                localStorage.setItem('is_logging_out', 'true');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                setTimeout(() => {
                    localStorage.removeItem('is_logging_out');
                    window.location.href = '/login';
                }, 2000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
