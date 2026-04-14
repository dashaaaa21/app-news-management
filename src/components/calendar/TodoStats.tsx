import React from 'react';

interface TodoStatsProps {
    completedCount: number;
    totalCount: number;
}

const TodoStats: React.FC<TodoStatsProps> = ({ completedCount, totalCount }) => {
    return (
        <p className="text-sm text-gray-500 mb-6">
            {completedCount} of {totalCount} completed
        </p>
    );
};

export default TodoStats;

