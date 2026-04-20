import React, { useState } from 'react';

interface TodoInputProps {
    onAddTodo: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddTodo = () => {
        if (inputValue.trim()) {
            onAddTodo(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a todo..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CEFF7D] text-sm"
            />
            <button
                onClick={handleAddTodo}
                className="px-4 py-2 bg-[#CEFF7D] hover:bg-[#cbf475] text-black font-semibold rounded-lg transition-colors"
            >
                Add
            </button>
        </div>
    );
};

export default TodoInput;
