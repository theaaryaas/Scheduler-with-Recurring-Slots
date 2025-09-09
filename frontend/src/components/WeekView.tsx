import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface WeekViewProps {
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentWeek,
  onPreviousWeek,
  onNextWeek,
}) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Week Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentWeek, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onPreviousWeek}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNextWeek}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => {
          const isSelected = false; // You can add selection logic here

          return (
            <div
              key={day.toISOString()}
              className={`p-4 text-center border-r last:border-r-0 ${
                isSelected ? 'bg-purple-600 text-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                {dayNames[day.getDay()]}
              </div>
              <div className={`text-2xl font-bold mt-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
