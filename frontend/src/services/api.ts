import axios from 'axios';
import { Slot, CreateSlotRequest, UpdateSlotRequest, WeekSlotsResponse } from '../types/slot';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const slotApi = {
  createSlot: async (slotData: CreateSlotRequest): Promise<Slot> => {
    const response = await api.post('/api/slots', slotData);
    return response.data;
  },

  getSlotsForWeek: async (startDate: string, endDate: string): Promise<WeekSlotsResponse> => {
    const response = await api.get('/api/slots/week', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  updateSlot: async (slotId: number, updateData: UpdateSlotRequest): Promise<Slot> => {
    const response = await api.put(`/api/slots/${slotId}`, updateData);
    return response.data;
  },

  deleteSlot: async (slotId: number): Promise<void> => {
    await api.delete(`/api/slots/${slotId}`);
  },
};
