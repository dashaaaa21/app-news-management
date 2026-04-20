import React from 'react';

interface CalendarHeaderProps {
    month: number;
    year: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    month,
    year,
    onPrevMonth,
    onNextMonth,
}) => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
                {monthNames[month]} {year}
            </h2>
            <div className="flex gap-2">
                <button
                    onClick={onPrevMonth}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    ←
                </button>
                <button
                    onClick={onNextMonth}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;
