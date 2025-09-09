export interface Slot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  specific_date?: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSlotRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpdateSlotRequest {
  start_time?: string;
  end_time?: string;
}

export interface WeekSlotsResponse {
  [date: string]: Slot[];
}
