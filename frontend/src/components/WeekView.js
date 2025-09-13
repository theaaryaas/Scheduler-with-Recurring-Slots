import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
export const WeekView = ({ currentWeek, onPreviousWeek, onNextWeek, }) => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 }); // Sunday
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "px-6 py-4 border-b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: format(currentWeek, 'MMMM yyyy') }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: onPreviousWeek, className: "p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100", children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsx("button", { onClick: onNextWeek, className: "p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100", children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }) })] })] }) }), _jsx("div", { className: "grid grid-cols-7", children: weekDays.map((day) => {
                    const isSelected = false; // You can add selection logic here
                    return (_jsxs("div", { className: `p-4 text-center border-r last:border-r-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-50'}`, children: [_jsx("div", { className: `text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`, children: dayNames[day.getDay()] }), _jsx("div", { className: `text-2xl font-bold mt-1 ${isSelected ? 'text-white' : 'text-gray-900'}`, children: format(day, 'd') })] }, day.toISOString()));
                }) })] }));
};
