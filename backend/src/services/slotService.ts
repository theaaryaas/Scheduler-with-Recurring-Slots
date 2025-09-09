import { db } from '../database/connection';
import { Slot, CreateSlotRequest, UpdateSlotRequest, WeekSlotsResponse } from '../types/slot';

export class SlotService {
  async createSlot(slotData: CreateSlotRequest): Promise<Slot> {
    const [slot] = await db('slots')
      .insert({
        ...slotData,
        is_recurring: true
      })
      .returning('*');
    
    return slot;
  }

  async getSlotsForWeek(startDate: string, endDate: string): Promise<WeekSlotsResponse> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get recurring slots
    const recurringSlots = await db('slots')
      .where('is_recurring', true)
      .select('*');

    // Get exception slots for the date range
    const exceptionSlots = await db('slots')
      .where('is_recurring', false)
      .whereBetween('specific_date', [startDate, endDate])
      .select('*');

    const weekSlots: WeekSlotsResponse = {};

    // Generate dates for the week
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      
      weekSlots[dateStr] = [];

      // Add recurring slots for this day of week
      const dayRecurringSlots = recurringSlots.filter(slot => slot.day_of_week === dayOfWeek);
      
      // Add exception slots for this specific date
      const dayExceptionSlots = exceptionSlots.filter(slot => slot.specific_date === dateStr);

      // Combine and deduplicate (exceptions override recurring)
      const allSlots = [...dayRecurringSlots, ...dayExceptionSlots];
      
      // Remove duplicates based on time (exceptions take precedence)
      const uniqueSlots = allSlots.reduce((acc, slot) => {
        const key = `${slot.start_time}-${slot.end_time}`;
        if (!acc.has(key)) {
          acc.set(key, slot);
        }
        return acc;
      }, new Map());

      weekSlots[dateStr] = Array.from(uniqueSlots.values());

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weekSlots;
  }

  async updateSlot(slotId: number, updateData: UpdateSlotRequest): Promise<Slot> {
    // First, get the original slot
    const originalSlot = await db('slots').where('id', slotId).first();
    
    if (!originalSlot) {
      throw new Error('Slot not found');
    }

    // If it's a recurring slot, create an exception for the specific date
    if (originalSlot.is_recurring) {
      const specificDate = new Date().toISOString().split('T')[0];
      
      // Create exception slot
      const [exceptionSlot] = await db('slots')
        .insert({
          day_of_week: originalSlot.day_of_week,
          start_time: updateData.start_time || originalSlot.start_time,
          end_time: updateData.end_time || originalSlot.end_time,
          specific_date: specificDate,
          is_recurring: false
        })
        .returning('*');

      return exceptionSlot;
    } else {
      // Update existing exception slot
      const [updatedSlot] = await db('slots')
        .where('id', slotId)
        .update(updateData)
        .returning('*');

      return updatedSlot;
    }
  }

  async deleteSlot(slotId: number): Promise<void> {
    const slot = await db('slots').where('id', slotId).first();
    
    if (!slot) {
      throw new Error('Slot not found');
    }

    if (slot.is_recurring) {
      // Create a deletion exception
      const specificDate = new Date().toISOString().split('T')[0];
      
      await db('slots')
        .insert({
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.start_time, // Mark as deleted by setting end_time to start_time
          specific_date: specificDate,
          is_recurring: false
        });
    } else {
      // Delete the exception slot
      await db('slots').where('id', slotId).del();
    }
  }
}
