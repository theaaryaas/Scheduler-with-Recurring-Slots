import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Slot, CreateSlotRequest, UpdateSlotRequest } from '../types/slot';

interface SlotModalProps {
  slot?: Slot | null;
  selectedDate?: Date | null;
  onClose: () => void;
  onSave: (data: CreateSlotRequest | UpdateSlotRequest) => Promise<void> | void;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  slot,
  selectedDate,
  onClose,
  onSave,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    { value: 'Work', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Personal', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'Health', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'Education', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'Social', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'General', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  useEffect(() => {
    if (slot) {
      setStartTime(slot.start_time);
      setEndTime(slot.end_time);
      setCategory(slot.category || 'General');
    } else {
      setStartTime('');
      setEndTime('');
      setCategory('General');
    }
    setErrors({});
  }, [slot]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!endTime) {
      newErrors.endTime = 'End time is required';
    }
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (slot) {
      // Update existing slot
      onSave({
        start_time: startTime,
        end_time: endTime,
        category: category,
      });
    } else if (selectedDate) {
      // Create new slot
      onSave({
        day_of_week: selectedDate.getDay(),
        start_time: startTime,
        end_time: endTime,
        category: category,
      });
    } else {
    }
  };

  const isEditing = !!slot;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Slot' : 'Add New Slot'}
          </h3>
          {selectedDate && !isEditing && (
            <p className="text-sm text-gray-600 mt-1">
              {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`input-field ${errors.startTime ? 'border-red-500' : ''}`}
                required
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`input-field ${errors.endTime ? 'border-red-500' : ''}`}
                required
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.value}
                  </option>
                ))}
              </select>
            </div>

            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      This slot will be created as a recurring slot for all {selectedDate ? format(selectedDate, 'EEEE') : 'selected day'}s.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {isEditing ? 'Update Slot' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
