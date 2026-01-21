import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Logger & Auth Token
api.interceptors.request.use(request => {
    console.log('🚀 [API] Request:', request.method?.toUpperCase(), request.url, request.data);

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
        console.log('✅ [API] Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('❌ [API] Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
