import axios from 'axios';

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
    // Attach Token if exists
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
    }

    return request;
});

// Response Interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            if (!localStorage.getItem('is_logging_out')) {
                localStorage.setItem('is_logging_out', 'true');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Notify hooks to update state immediately
                window.dispatchEvent(new Event('auth-change'));
                
                import('react-hot-toast').then((toast) => {
                    toast.default.error('Sesi Anda telah berakhir. Silakan login kembali.');
                });
                
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
