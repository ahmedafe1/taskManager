'use client';

import { useState } from 'react';
import { TaskFormData } from '@/types';

interface TaskFormProps {
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
    initialData?: TaskFormData;
}

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
    const [formData, setFormData] = useState<TaskFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        dueDate: initialData?.dueDate || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert the date to UTC if it exists
        const dataToSubmit = {
            ...formData,
            dueDate: formData.dueDate 
                ? new Date(formData.dueDate).toISOString() 
                : null
        };
        
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
                />
            </div>

            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">
                    Due Date
                </label>
                <input
                    type="datetime-local"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    {initialData ? 'Update' : 'Create'} Task
                </button>
            </div>
        </form>
    );
} 