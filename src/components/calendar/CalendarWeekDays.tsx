import React from 'react';

const CalendarWeekDays: React.FC = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
                <div
                    key={day}
                    className="text-center font-semibold text-gray-600 py-2"
                >
                    {day}
                </div>
            ))}
        </div>
    );
};

export default CalendarWeekDays;

