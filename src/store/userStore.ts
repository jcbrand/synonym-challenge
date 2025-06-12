import { create } from 'zustand';
import { User, db } from '../lib/db';

interface UserState {
    users: User[];
    filteredUsers: User[];
    loading: boolean;
    error: string | null;
    isOnline: boolean;
    page: number;
    pageSize: number;
    searchQuery: string;
    fetchUsers: (page?: number) => Promise<void>;
    toggleFavorite: (uuid: string) => void;
    setOnlineStatus: (status: boolean) => void;
    setSearchQuery: (query: string) => void;
    clearSearch: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    filteredUsers: [],
    loading: false,
    error: null,
    isOnline: true,
    page: 1,
    pageSize: 10,
    searchQuery: '',

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            // Always try to load from IndexedDB first
            const cachedUsers = await db.users
                .offset((page - 1) * get().pageSize)
                .limit(get().pageSize)
                .toArray();

            // If we have cached data for this page, use it
            if (cachedUsers.length === get().pageSize) {
                set({ users: cachedUsers, page });
                return;
            }

            // Otherwise fetch from API if online
            if (get().isOnline) {
                const response = await fetch(`https://randomuser.me/api/?page=${page}&results=${get().pageSize}`);
                const data = await response.json();
                const users = await Promise.all(
                    data.results.map(async (user: any) => {
                        return {
                            ...user,
                            uuid: user.login.uuid,
                            isFavorite: false,
                            picture: {
                                ...user.picture,
                                largeData: await fetchImageAsBase64(user.picture.large),
                            },
                        };
                    })
                );
                await db.users.bulkPut(users);
                set({ users, page });
            } else {
                // Use whatever partial cached data we have
                if (cachedUsers.length > 0) {
                    set({ users: cachedUsers, page });
                } else {
                    throw new Error('Offline and no cached data available');
                }
            }
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to fetch users' });
            // Try loading from cache even if fetch failed
            const users = await db.users
                .offset((page - 1) * get().pageSize)
                .limit(get().pageSize)
                .toArray();
            if (users.length) set({ users, page });
        } finally {
            set({ loading: false });
        }
    },

    toggleFavorite: async (uuid: string) => {
        const user = await db.users.get(uuid);
        if (user) {
            await db.users.update(uuid, { isFavorite: !user.isFavorite });
            set({
                users: get().users.map((u) => (u.uuid === uuid ? { ...u, isFavorite: !u.isFavorite } : u)),
            });
        }
    },

    setOnlineStatus: (status: boolean) => set({ isOnline: status }),
    setSearchQuery: (query: string) => {
        set((state) => {
            const filtered = query
                ? state.users.filter(
                      (user) =>
                          `${user.name.first} ${user.name.last}`.toLowerCase().includes(query.toLowerCase()) ||
                          user.email.toLowerCase().includes(query.toLowerCase()) ||
                          user.nat.toLowerCase().includes(query.toLowerCase())
                  )
                : state.users;
            return {
                searchQuery: query,
                filteredUsers: filtered,
                page: 1, // Reset to first page when searching
            };
        });
    },
    clearSearch: () =>
        set({
            searchQuery: '',
            filteredUsers: [],
            page: 1,
        }),
}));
