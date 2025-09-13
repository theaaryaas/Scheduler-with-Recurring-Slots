import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add request interceptor for debugging
api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});
// Add response interceptor for error handling
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.error('Response error:', error.response?.status, error.message);
    console.error('Full error:', error);
    return Promise.reject(error);
});
export const slotApi = {
    createSlot: async (slotData) => {
        const response = await api.post('/api/slots', slotData);
        return response.data;
    },
    getSlotsForWeek: async (startDate, endDate) => {
        const response = await api.get('/api/slots/week', {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data;
    },
    updateSlot: async (slotId, updateData) => {
        const response = await api.put(`/api/slots/${slotId}`, updateData);
        return response.data;
    },
    deleteSlot: async (slotId) => {
        await api.delete(`/api/slots/${slotId}`);
    },
};
