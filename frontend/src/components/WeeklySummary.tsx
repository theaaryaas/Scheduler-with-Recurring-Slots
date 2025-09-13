import React from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { Slot } from '../types/slot';

interface WeeklySummaryProps {
  currentWeek: Date;
  slots: { [date: string]: Slot[] };
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ currentWeek, slots }) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate total hours for the week
  const calculateTotalHours = () => {
    let totalMinutes = 0;
    
    weekDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const daySlots = slots[dateStr] || [];
      
      daySlots.forEach(slot => {
        const startTime = new Date(`2000-01-01T${slot.start_time}`);
        const endTime = new Date(`2000-01-01T${slot.end_time}`);
        const duration = endTime.getTime() - startTime.getTime();
        totalMinutes += duration / (1000 * 60);
      });
    });
    
    return totalMinutes / 60; // Convert to hours
  };

  // Calculate hours by category
  const calculateCategoryHours = () => {
    const categoryHours: { [key: string]: number } = {};
    
    weekDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const daySlots = slots[dateStr] || [];
      
      daySlots.forEach(slot => {
        const category = slot.category || 'General';
        const startTime = new Date(`2000-01-01T${slot.start_time}`);
        const endTime = new Date(`2000-01-01T${slot.end_time}`);
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours
        
        categoryHours[category] = (categoryHours[category] || 0) + duration;
      });
    });
    
    return categoryHours;
  };

  // Calculate slots per day
  const calculateSlotsPerDay = () => {
    return weekDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const daySlots = slots[dateStr] || [];
      return {
        date: day,
        count: daySlots.length,
        hours: daySlots.reduce((total, slot) => {
          const startTime = new Date(`2000-01-01T${slot.start_time}`);
          const endTime = new Date(`2000-01-01T${slot.end_time}`);
          return total + (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        }, 0)
      };
    });
  };

  const totalHours = calculateTotalHours();
  const categoryHours = calculateCategoryHours();
  const slotsPerDay = calculateSlotsPerDay();

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-800',
      'Personal': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Social': 'bg-yellow-100 text-yellow-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.General;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
      
      {/* Total Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Scheduled</p>
              <p className="text-2xl font-bold text-purple-900">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Slots</p>
              <p className="text-2xl font-bold text-blue-900">
                {Object.values(slots).flat().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Avg per Day</p>
              <p className="text-2xl font-bold text-green-900">
                {(totalHours / 7).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryHours).length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Time by Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(categoryHours).map(([category, hours]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                  {category}
                </span>
                <span className="text-sm font-medium text-gray-900">{hours.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Breakdown */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 mb-3">Daily Overview</h4>
        <div className="grid grid-cols-7 gap-2">
          {slotsPerDay.map(({ date, count, hours }) => (
            <div key={format(date, 'yyyy-MM-dd')} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">{hours.toFixed(1)}h</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
