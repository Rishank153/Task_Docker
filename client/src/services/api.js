import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Response Interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Tasks
export const getTasks = () => api.get('/tasks');
export const createTask = (taskData) => api.post('/tasks', taskData); // ✅ updated
export const assignTask = (taskId) => api.put(`/tasks/${taskId}/assign`);
export const completeTask = (taskId) => api.put(`/tasks/${taskId}/complete`);

// Users
export const getUsers = () => api.get('/users');
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export default api;
