import { db } from '../database/connection';
import { Slot, CreateSlotRequest, UpdateSlotRequest, WeekSlotsResponse } from '../types/slot';

export class SlotService {
  async createSlot(slotData: CreateSlotRequest): Promise<Slot> {
    const [slot] = await db('slots')
      .insert({
        day_of_week: slotData.day_of_week,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
        category: slotData.category || 'General',
        is_recurring: true,
        specific_date: null
      })
      .returning('*');

    return slot;
  }

  async getSlotsForWeek(startDate: string, endDate: string): Promise<WeekSlotsResponse> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const weekSlots: WeekSlotsResponse = {};

      // Generate dates for the week
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        
        weekSlots[dateStr] = [];

        try {
          // Get recurring slots for this day of week
          const dayRecurringSlots = await db('slots')
            .where({ day_of_week: dayOfWeek, is_recurring: true });
          
          // Get exception slots for this specific date
          const dayExceptionSlots = await db('slots')
            .where({ specific_date: dateStr, is_recurring: false });

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
        } catch (error) {
          console.error('Error fetching slots for date:', dateStr, error);
          weekSlots[dateStr] = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return weekSlots;
    } catch (error) {
      console.error('Error in getSlotsForWeek:', error);
      throw error;
    }
  }

  async updateSlot(slotId: number, updateData: UpdateSlotRequest): Promise<Slot> {
    const originalSlot = await db('slots').where({ id: slotId }).first();
    
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
                 category: updateData.category || originalSlot.category,
                 specific_date: specificDate,
                 is_recurring: false
               })
               .returning('*');

      return exceptionSlot;
    } else {
      // Update existing exception slot
      const [updatedSlot] = await db('slots')
        .where({ id: slotId })
        .update({
          start_time: updateData.start_time || originalSlot.start_time,
          end_time: updateData.end_time || originalSlot.end_time,
          category: updateData.category || originalSlot.category,
          updated_at: new Date()
        })
        .returning('*');

      return updatedSlot;
    }
  }

  async deleteSlot(slotId: number): Promise<void> {
    const slot = await db('slots').where({ id: slotId }).first();
    
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
      await db('slots').where({ id: slotId }).del();
    }
  }
}
