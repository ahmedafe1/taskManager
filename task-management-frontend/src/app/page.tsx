'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskList from '@/components/tasks/TaskList';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function Home() {
    const { user, loading, logout } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-purple-400">Task Management</h1>
                        </div>
                        {user && (
                            <div className="flex items-center">
                                <button
                                    onClick={logout}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {user ? (
                    <TaskList />
                ) : (
                    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                        <div className="w-full max-w-md">
                            {showRegister ? (
                                <RegisterForm onShowLogin={() => setShowRegister(false)} />
                            ) : (
                                <LoginForm onShowRegister={() => setShowRegister(true)} />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
