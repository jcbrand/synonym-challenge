export function LoadingSkeleton({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="animate-pulse">
                        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700" />
                        <div className="p-4 space-y-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
