import { useUserStore } from '../store/userStore';

interface ErrorFallbackProps {
    error: string;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
    const fetchUsers = useUserStore((state) => state.fetchUsers);

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Error loading users</h3>
            <p className="mb-4">{error}</p>
            <button
                onClick={() => fetchUsers(1)}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded"
            >
                Retry
            </button>
        </div>
    );
}
