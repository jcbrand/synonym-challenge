import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';
import { UserCard } from './UserCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorFallback } from './ErrorFallback';
import { OfflineBanner } from './OfflineBanner';

export function UserList() {
    const { users, loading, error, isOnline, page, pageSize, totalUsers, fetchUsers, setOnlineStatus } = useUserStore();

    useEffect(() => {
        // Set up online/offline listeners
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setOnlineStatus(navigator.onLine);

        // Initial fetch
        fetchUsers(page);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [fetchUsers, page, setOnlineStatus]);

    if (loading && users.length === 0) {
        return <LoadingSkeleton count={pageSize} />;
    }

    if (error) {
        return <ErrorFallback error={error} />;
    }

    return (
        <div className="space-y-4">
            {!isOnline && <OfflineBanner />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <UserCard key={user.uuid} user={user} />
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => fetchUsers(page - 1)}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                    Page {page} of {Math.ceil(totalUsers / pageSize)}
                </span>
                <button
                    onClick={() => fetchUsers(page + 1)}
                    disabled={page * pageSize >= totalUsers || loading}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
