import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_RETRY_ATTEMPTS = 2;
const RETRY_BASE_DELAY_MS = 1200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryRequest = (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) return false;

    const method = error.config.method?.toLowerCase();
    const status = error.response?.status;

    // Retry only safe/read requests to avoid duplicate side-effects.
    const isSafeMethod = method === 'get' || method === 'head' || method === 'options';
    const isNetworkOrTimeout = !error.response || error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('network error');
    const isLikelyWakingUp = status === 502 || status === 503 || status === 504;

    return isSafeMethod && (isNetworkOrTimeout || isLikelyWakingUp);
};

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
let isHandling401 = false; // module-level flag, resets on page reload — no stuck risk
api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (shouldRetryRequest(error)) {
            const retryCount = Number((error.config as { __retryCount?: number }).__retryCount || 0);

            if (retryCount < MAX_RETRY_ATTEMPTS) {
                (error.config as { __retryCount?: number }).__retryCount = retryCount + 1;
                const delayMs = RETRY_BASE_DELAY_MS * (retryCount + 1);
                await sleep(delayMs);
                return api.request(error.config);
            }
        }

        // Skip 401 handling for the /auth/me endpoint itself (authStore handles it directly)
        const isAuthMeRequest = error.config?.url?.includes('/auth/me');

        if (error.response?.status === 401 && typeof window !== 'undefined' && !isHandling401 && !isAuthMeRequest) {
            isHandling401 = true;

            // Use authStore logout for consistent handling (shows toast + clears store)
            const { useAuthStore } = await import('./authStore');
            useAuthStore.getState().logout('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        return Promise.reject(error);
    }
);

export default api;
