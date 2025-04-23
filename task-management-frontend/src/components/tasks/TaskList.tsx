'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TaskFormData } from '@/types';
import { api } from '@/services/api';
import TaskForm from './TaskForm';

type StatusFilter = 'all' | 'completed' | 'pending';
type DateFilter = 'all' | 'today' | 'this-week' | 'this-month';

export default function TaskList() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            if (!user?.token) return;
            setLoading(true);
            const tasks = await api.tasks.getAll(user.token);
            setTasks(tasks);
            setError('');
        } catch (err: any) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = (tasks: Task[]) => {
        return tasks.filter(task => {
            // Apply status filter
            if (statusFilter === 'completed' && !task.isComplete) return false;
            if (statusFilter === 'pending' && task.isComplete) return false;

            // Apply date filter
            if (!task.dueDate) return true;
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (dateFilter) {
                case 'today':
                    return dueDate.toDateString() === today.toDateString();
                case 'this-week': {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return dueDate >= weekStart && dueDate <= weekEnd;
                }
                case 'this-month': {
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    return dueDate >= monthStart && dueDate <= monthEnd;
                }
                default:
                    return true;
            }
        });
    };

    const handleCreateTask = async (taskData: TaskFormData) => {
        try {
            if (!user?.token) return;
            const newTask = await api.tasks.create(taskData, user.token);
            setTasks([...tasks, newTask]);
            setShowForm(false);
        } catch (err: any) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
        try {
            if (!user?.token) return;
            
            // Format the updates based on whether it's a form submission or checkbox update
            const formattedUpdates = 'dueDate' in updates
                ? {
                    ...updates,
                    dueDate: updates.dueDate 
                        ? new Date(updates.dueDate).toISOString() 
                        : updates.dueDate
                }
                : updates;
            
            const updatedTask = await api.tasks.update(taskId, formattedUpdates, user.token);
            setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
            setEditingTask(null);
            setShowForm(false);
        } catch (err: any) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            if (!user?.token) return;
            await api.tasks.delete(taskId, user.token);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err: any) {
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        }
    };

    const handleFormSubmit = async (data: TaskFormData) => {
        if (editingTask) {
            await handleUpdateTask(editingTask.id, data);
        } else {
            await handleCreateTask(data);
        }
    };

    const handleCheckboxChange = async (taskId: string, isComplete: boolean) => {
        try {
            if (!user?.token) return;
            
            // Log the update attempt
            console.log('Updating task:', { taskId, isComplete });
            
            // Send isComplete as a nullable boolean to match the backend DTO
            const updateData = {
                isComplete: isComplete
            };
            
            const updatedTask = await api.tasks.update(taskId, updateData, user.token);
            
            // Log the successful update
            console.log('Task updated successfully:', updatedTask);
            
            setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        } catch (err: any) {
            console.error('Error updating task status:', err);
            setError(err.message || 'Failed to update task status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const filteredTasks = filterTasks(tasks);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-purple-400">My Tasks</h2>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
                >
                    Add Task
                </button>
            </div>

            <div className="flex space-x-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>

                <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="all">All Dates</option>
                    <option value="today">Due Today</option>
                    <option value="this-week">Due This Week</option>
                    <option value="this-month">Due This Month</option>
                </select>
            </div>

            {error && (
                <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md border border-red-800">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                    <TaskForm
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingTask(null);
                        }}
                        initialData={editingTask}
                    />
                </div>
            )}

            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <p className="text-center text-gray-400">No tasks found. {tasks.length > 0 ? 'Try changing your filters.' : 'Create your first task!'}</p>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 hover:border-purple-500 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={task.isComplete}
                                        onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
                                        className="mt-1 h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                                    />
                                    <div>
                                        <h3 className={`text-lg font-medium text-white ${task.isComplete ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="mt-1 text-gray-300">{task.description}</p>
                                        )}
                                        <p className="mt-2 text-sm text-purple-400">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingTask(task);
                                            setShowForm(true);
                                        }}
                                        className="text-purple-400 hover:text-purple-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 