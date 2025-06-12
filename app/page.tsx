'use client';

import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import UserCard from '../components/UserCard';
import OfflineBanner from '../components/OfflineBanner';

export default function Home() {
    const { users, loading, error, fetchUsers, page } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">User Directory</h1>

            <OfflineBanner />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            <div className="flex justify-between mt-6">
                <button disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
                    Previous
                </button>
                <span className="self-center">Page {page}</span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => useUserStore.setState({ page: page + 1 })}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
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
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                {isOnline ? 'User Directory' : 'User Directory (Offline)'}
            </h1>
            <UserList />
        </main>
    );
}
