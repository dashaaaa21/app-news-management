interface Todo {
    id: string;
    date: string;
    text: string;
    completed: boolean;
}

const TODOS_STORAGE_KEY = 'user_todos';

export const getTodosFromStorage = (): Todo[] => {
    try {
        const stored = localStorage.getItem(TODOS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const saveTodosToStorage = (todos: Todo[]): void => {
    try {
        localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch {
        console.error('Failed to save todos to storage');
    }
};

export const clearTodosFromStorage = (): void => {
    try {
        localStorage.removeItem(TODOS_STORAGE_KEY);
    } catch {
        console.error('Failed to clear todos from storage');
    }
};
