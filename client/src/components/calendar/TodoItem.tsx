import React from 'react';

interface TodoItemProps {
    id: string;
    text: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    id,
    text,
    completed,
    onToggle,
    onDelete,
}) => {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggle(id)}
                className="mt-1 w-5 h-5 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm break-words ${
                        completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-900'
                    }`}
                >
                    {text}
                </p>
            </div>
            <button
                onClick={() => onDelete(id)}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
};

export default TodoItem;
