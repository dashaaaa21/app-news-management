import React, { useState, useEffect } from 'react';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import TodoList from '../../components/calendar/TodoList';
import { getTodosFromStorage, saveTodosToStorage } from '../../common/utils/todoStorage';

interface Todo {
    id: string;
    date: string;
    text: string;
    completed: boolean;
}

const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const storedTodos = getTodosFromStorage();
        setTodos(storedTodos);
    }, []);

    const handleAddTodo = (text: string) => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const newTodo: Todo = {
            id: Date.now().toString(),
            date: dateStr,
            text,
            completed: false,
        };
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        saveTodosToStorage(updatedTodos);
    };

    const handleToggleTodo = (id: string) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        );
        setTodos(updatedTodos);
        saveTodosToStorage(updatedTodos);
    };

    const handleDeleteTodo = (id: string) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        saveTodosToStorage(updatedTodos);
    };

    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayTodos = todos.filter((todo) => todo.date === dateStr);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold mb-8">My Calendar</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CalendarGrid
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            todos={todos}
                        />
                    </div>

                    <div>
                        <TodoList
                            selectedDate={selectedDate}
                            todos={dayTodos}
                            onAddTodo={handleAddTodo}
                            onToggleTodo={handleToggleTodo}
                            onDeleteTodo={handleDeleteTodo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;

