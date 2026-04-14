import React from 'react';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import TodoStats from './TodoStats';

interface Todo {
    id: string;
    date: string;
    text: string;
    completed: boolean;
}

interface TodoListProps {
    selectedDate: Date;
    todos: Todo[];
    onAddTodo: (text: string) => void;
    onToggleTodo: (id: string) => void;
    onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
    selectedDate,
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
}) => {
    const dateStr = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const completedCount = todos.filter((todo) => todo.completed).length;

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 p-6 h-fit sticky top-8">
            <h3 className="text-lg font-bold mb-2">{dateStr}</h3>
            <TodoStats completedCount={completedCount} totalCount={todos.length} />

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {todos.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">
                        No todos for this day
                    </p>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.text}
                            completed={todo.completed}
                            onToggle={onToggleTodo}
                            onDelete={onDeleteTodo}
                        />
                    ))
                )}
            </div>

            <TodoInput onAddTodo={onAddTodo} />
        </div>
    );
};

export default TodoList;

