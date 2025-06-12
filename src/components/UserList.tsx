import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';
import { UserCard } from './UserCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorFallback } from './ErrorFallback';
import { OfflineBanner } from './OfflineBanner';

export function UserList() {
    const {
        users,
        filteredUsers,
        loading,
        error,
        isOnline,
        page,
        pageSize,
        searchQuery,
        fetchUsers,
        setOnlineStatus,
        setSearchQuery,
        clearSearch,
    } = useUserStore();

    const displayUsers = searchQuery ? filteredUsers : users;

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
            <div className="flex justify-between items-center mb-4 gap-2">
                {!isOnline && <OfflineBanner />}
                {isOnline && (
                    <button
                        onClick={() => useUserStore.getState().toggleManualOffline()}
                        className={`px-4 py-2 rounded ${
                            useUserStore.getState().isManualOffline 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-white`}
                    >
                        {useUserStore.getState().isManualOffline ? 'Go Online' : 'Go Offline'}
                    </button>
                )}
            </div>

            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search by name, email or nationality..."
                    className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={clearSearch} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
                        Clear
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayUsers.map((user) => (
                    <UserCard key={user.uuid} user={user} />
                ))}
            </div>

            {!searchQuery && (
                <div className="flex justify-between items-center mt-6 gap-2">
                    <button
                        onClick={() => fetchUsers(page - 1)}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">Page {page}</span>
                    <button
                        onClick={() => fetchUsers(page + 1)}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
