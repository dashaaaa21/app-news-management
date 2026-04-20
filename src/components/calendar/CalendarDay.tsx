import React from 'react';

interface CalendarDayProps {
    day: number | null;
    isSelected: boolean;
    isToday: boolean;
    todoCount: number;
    onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
    day,
    isSelected,
    isToday,
    todoCount,
    onClick,
}) => {
    if (!day) {
        return <div className="aspect-square bg-transparent" />;
    }

    return (
        <button
            onClick={onClick}
            className={`aspect-square rounded-lg font-semibold transition-all relative flex flex-col items-center justify-center text-sm ${
                isSelected
                    ? 'bg-[#CEFF7D] text-black'
                    : isToday
                      ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
            }`}
        >
            <span>{day}</span>
            {todoCount > 0 && (
                <span className="text-xs mt-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {todoCount}
                </span>
            )}
        </button>
    );
};

export default CalendarDay;
