import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { WeekView } from './WeekView';
import { DaySlots } from './DaySlots';
import { SlotModal } from './SlotModal';
import { slotApi } from '../services/api';
import { Slot, CreateSlotRequest } from '../types/slot';

export const Scheduler: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [slots, setSlots] = useState<{ [date: string]: Slot[] }>({});
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const loadSlots = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      const weekSlots = await slotApi.getSlotsForWeek(startDateStr, endDateStr);
      setSlots(weekSlots);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots(weekStart, weekEnd);
  }, [currentWeek, loadSlots, weekStart, weekEnd]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleCreateSlot = async (slotData: CreateSlotRequest) => {
    try {
      await slotApi.createSlot(slotData);
      loadSlots(weekStart, weekEnd);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create slot:', error);
    }
  };

  const handleUpdateSlot = async (slotId: number, updateData: { start_time?: string; end_time?: string }) => {
    try {
      await slotApi.updateSlot(slotId, updateData);
      loadSlots(weekStart, weekEnd);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      await slotApi.deleteSlot(slotId);
      loadSlots(weekStart, weekEnd);
    } catch (error) {
      console.error('Failed to delete slot:', error);
    }
  };

  const handleAddSlot = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Your Schedule</h1>
            </div>
            <button className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Week Navigation */}
        <WeekView
          currentWeek={currentWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />

        {/* Daily Slots */}
        <div className="mt-6 space-y-4">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const daySlots = slots[dateStr] || [];
            const isCurrentDay = isToday(day);

            return (
              <DaySlots
                key={dateStr}
                date={day}
                slots={daySlots}
                isToday={isCurrentDay}
                onAddSlot={() => handleAddSlot(day)}
                onEditSlot={handleEditSlot}
                onDeleteSlot={handleDeleteSlot}
              />
            );
          })}
        </div>
      </div>

      {/* Slot Modal */}
      {isModalOpen && (
        <SlotModal
          slot={selectedSlot}
          selectedDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSave={selectedSlot ? 
            (data) => handleUpdateSlot(selectedSlot.id, data) : 
            handleCreateSlot
          }
        />
      )}
    </div>
  );
};
