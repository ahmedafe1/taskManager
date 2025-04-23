export interface User {
    id: string;
    username: string;
    email: string;
    token: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: string | null;
    isComplete?: boolean;
    userId: string;
}

export interface TaskFormData {
    title: string;
    description?: string;
    dueDate?: string | null;
} 