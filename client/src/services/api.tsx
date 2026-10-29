import axios, { type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});

let isRefreshing = false;
type RetryRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type QueuedRequest = {
    resolve: () => void;
    reject: (error: unknown) => void;
};
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!axios.isAxiosError(error) || !error.config) {
            return Promise.reject(error);
        }
        const originalRequest: RetryRequestConfig = error.config;

        // 👇 FIX: don't let the refresh endpoint trigger another refresh
        if (originalRequest?.url?.includes('/auth/refresh-token')) {
            return Promise.reject(error);
        }

        // Check if error is 401 and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If we are already refreshing, queue this request
            if (isRefreshing) {
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/auth/refresh-token');

                isRefreshing = false;
                processQueue(null);

                // Retry the original failed request
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError);

                // window.location.href = '/sign-in';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;