'use client';

import { useUserStore } from '../store/userStore';

export function OfflineBanner() {
    const { isOnline, isManualOffline } = useUserStore();

    if (isOnline && !isManualOffline) return null;

    return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            You are currently offline. Showing cached data.
        </div>
    );
}
