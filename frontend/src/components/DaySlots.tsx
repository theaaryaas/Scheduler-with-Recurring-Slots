import React from 'react';
import { format } from 'date-fns';
import { Slot } from '../types/slot';

interface DaySlotsProps {
  date: Date;
  slots: Slot[];
  isToday: boolean;
  onAddSlot: () => void;
  onEditSlot: (slot: Slot) => void;
  onDeleteSlot: (slotId: number) => void;
}

export const DaySlots: React.FC<DaySlotsProps> = ({
  date,
  slots,
  isToday,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) => {
  const canAddSlot = slots.length < 2;

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-800 border-blue-200',
      'Personal': 'bg-green-100 text-green-800 border-green-200',
      'Health': 'bg-red-100 text-red-800 border-red-200',
      'Education': 'bg-purple-100 text-purple-800 border-purple-200',
      'Social': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'General': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className={`text-lg font-medium ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
            {format(date, 'EEEE, dd MMMM')}
          </h3>
          {isToday && (
            <span className="text-sm text-purple-600 font-medium">(Today)</span>
          )}
        </div>
        {canAddSlot && (
          <button
            onClick={() => {
              onAddSlot();
            }}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {slots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-sm">No slots scheduled</p>
            {canAddSlot && (
              <button
                onClick={() => {
                  onAddSlot();
                }}
                className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Add your first slot
              </button>
            )}
          </div>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">
                  {slot.start_time} - {slot.end_time}
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(slot.category || 'General')}`}>
                  {slot.category || 'General'}
                </span>
                {slot.is_recurring && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Recurring
                  </span>
                )}
                {!slot.is_recurring && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Exception
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditSlot(slot)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteSlot(slot.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
