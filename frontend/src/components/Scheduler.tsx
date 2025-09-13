import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday } from 'date-fns';
import { WeekView } from './WeekView';
import { DaySlots } from './DaySlots';
import { SlotModal } from './SlotModal';
import { WeeklySummary } from './WeeklySummary';
import { slotApi } from '../services/api';
import { Slot, CreateSlotRequest } from '../types/slot';

export const Scheduler: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [slots, setSlots] = useState<{ [date: string]: Slot[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate week data
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Load slots when currentWeek changes
  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const startDateStr = format(weekStart, 'yyyy-MM-dd');
        const endDateStr = format(weekEnd, 'yyyy-MM-dd');
        const weekSlots = await slotApi.getSlotsForWeek(startDateStr, endDateStr);
        setSlots(weekSlots);
      } catch (error) {
        console.error('Failed to load slots:', error);
        setError('Failed to load schedule. Please check your connection.');
        setSlots({});
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, [currentWeek]); // Only depend on currentWeek

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
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

  const handleDeleteSlot = async (slotId: number) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await slotApi.deleteSlot(slotId);
        // Reload current week
        setCurrentWeek(new Date(currentWeek.getTime()));
      } catch (error) {
        console.error('Failed to delete slot:', error);
        setError('Failed to delete slot. Please try again.');
      }
    }
  };

  const handleSaveSlot = async (data: CreateSlotRequest | any) => {
    try {
      if (selectedSlot) {
        // Update existing slot
        await slotApi.updateSlot(selectedSlot.id, data);
      } else {
        // Create new slot
        await slotApi.createSlot(data as CreateSlotRequest);
      }
      setIsModalOpen(false);
      // Reload current week
      setCurrentWeek(new Date(currentWeek.getTime()));
    } catch (error) {
      console.error('Failed to save slot:', error);
      setError(`Failed to ${selectedSlot ? 'update' : 'create'} slot. Please try again.`);
    }
  };

  const handleGoToCurrentWeek = () => {
    setCurrentWeek(new Date());
    setIsMenuOpen(false);
  };

  const handleRefreshSchedule = () => {
    // Force reload by updating currentWeek
    setCurrentWeek(new Date(currentWeek.getTime()));
    setIsMenuOpen(false);
  };

  const handleClearErrors = () => {
    setError(null);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 menu-container"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute top-16 left-4 right-4 bg-white shadow-lg border rounded-md z-50 menu-container">
                  <div className="py-2">
                    <button
                      onClick={handleGoToCurrentWeek}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Go to Current Week
                    </button>
                    <button
                      onClick={handleRefreshSchedule}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Refresh Schedule
                    </button>
                    <button
                      onClick={handleClearErrors}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Clear Errors
                    </button>
                  </div>
                </div>
              )}
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Scheduler</h1>
            </div>
            <button
              onClick={() => handleAddSlot(new Date())}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Slot
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-sm text-blue-700">Loading schedule...</p>
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <WeekView
          currentWeek={currentWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
        />

        {/* Weekly Summary Dashboard */}
        <WeeklySummary currentWeek={currentWeek} slots={slots} />

        {/* Daily Slots */}
        <div className="mt-6 space-y-4">
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const daySlots = slots[dateStr] || [];
            return (
              <DaySlots
                key={dateStr}
                date={day}
                slots={daySlots}
                isToday={isToday(day)}
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
          onSave={handleSaveSlot}
        />
      )}
    </div>
  );
};