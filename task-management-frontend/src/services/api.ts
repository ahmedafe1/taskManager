import { User, Task, TaskFormData } from '@/types';

const API_URL = 'http://localhost:5000/api';

const getHeaders = (token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    auth: {
        login: async (email: string, password: string): Promise<User> => {
            try {
                const requestBody = { 
                    email: email,
                    password: password 
                };
                console.log('Login request body:', requestBody);
                console.log('Login request URL:', `${API_URL}/auth/login`);
                console.log('Login request headers:', getHeaders());
                
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(requestBody),
                });
                
                console.log('Login response status:', response.status);
                console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
                
                const responseText = await response.text();
                console.log('Login response text:', responseText);
                
                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(responseText);
                    } catch (e) {
                        errorData = { message: responseText };
                    }
                    console.log('Login error data:', errorData);
                    throw new Error(errorData.message || 'Login failed');
                }
                
                const data = JSON.parse(responseText);
                console.log('Login success data:', data);
                return data;
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.message === 'Failed to fetch') {
                    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
                }
                throw new Error(error.message || 'Login failed');
            }
        },
        register: async (username: string, email: string, password: string): Promise<User> => {
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ username, email, password }),
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Registration failed');
                }
                return response.json();
            } catch (error: any) {
                if (error.message === 'Failed to fetch') {
                    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
                }
                throw new Error(error.message || 'Registration failed');
            }
        },
    },
    tasks: {
        getAll: async (token: string): Promise<Task[]> => {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: getHeaders(token),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        },
        create: async (task: TaskFormData, token: string): Promise<Task> => {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            return response.json();
        },
        update: async (id: string, updates: Partial<Task>, token: string): Promise<Task> => {
            try {
                // Ensure we're sending only the fields that are being updated
                const updateData = Object.fromEntries(
                    Object.entries(updates).filter(([_, value]) => value !== undefined)
                );

                console.log('Sending update request:', {
                    url: `${API_URL}/tasks/${id}`,
                    method: 'PUT',
                    headers: getHeaders(token),
                    body: JSON.stringify(updateData)
                });

                const response = await fetch(`${API_URL}/tasks/${id}`, {
                    method: 'PUT',
                    headers: getHeaders(token),
                    body: JSON.stringify(updateData),
                });

                const responseText = await response.text();
                console.log('Raw response:', responseText);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(responseText);
                    } catch (e) {
                        errorData = { message: responseText || 'Unknown error' };
                    }
                    
                    console.error('Update failed:', {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorData,
                        requestBody: updateData
                    });
                    throw new Error(errorData.message || `Failed to update task: ${response.status} ${response.statusText}`);
                }

                return JSON.parse(responseText);
            } catch (error: any) {
                console.error('Update error:', error);
                throw error;
            }
        },
        delete: async (id: string, token: string): Promise<void> => {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: getHeaders(token),
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        },
    },
}; 