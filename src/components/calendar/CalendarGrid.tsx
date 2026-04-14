import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarWeekDays from './CalendarWeekDays';
import CalendarDay from './CalendarDay';

interface Todo {
    id: string;
    date: string;
    text: string;
    completed: boolean;
}

interface CalendarGridProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    todos: Todo[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    selectedDate,
    onDateSelect,
    todos,
}) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getTodosForDate = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().split('T')[0];
        return todos.filter((todo) => todo.date === dateStr).length;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    const handlePrevMonth = () => {
        onDateSelect(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        onDateSelect(new Date(year, month + 1, 1));
    };

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 p-6">
            <CalendarHeader
                month={month}
                year={year}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />

            <CalendarWeekDays />

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <CalendarDay
                        key={index}
                        day={day}
                        isSelected={day ? isSelected(day) : false}
                        isToday={day ? isToday(day) : false}
                        todoCount={day ? getTodosForDate(day) : 0}
                        onClick={() => {
                            if (day) {
                                onDateSelect(new Date(year, month, day));
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarGrid;

