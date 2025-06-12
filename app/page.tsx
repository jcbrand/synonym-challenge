'use client';

import { UserList } from '@/components/UserList';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function Home() {
    const { isOnline, setOnlineStatus } = useUserStore();

    useEffect(() => {
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setOnlineStatus(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [setOnlineStatus]);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="space-y-4 max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    {isOnline ? 'User Directory' : 'User Directory (Offline)'}
                </h1>
            </div>
            <UserList />
        </main>
    );
}
