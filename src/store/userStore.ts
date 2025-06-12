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
    totalUsers: number;
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
    totalUsers: 0,
    searchQuery: '',

    fetchUsers: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            // Try to fetch from API first if online
            if (get().isOnline) {
                const response = await fetch(`https://randomuser.me/api/?page=${page}&results=${get().pageSize}`);
                const data = await response.json();
                const users = data.results.map((user: any) => ({
                    ...user,
                    uuid: user.login.uuid,
                    isFavorite: false,
                }));

                // Save to IndexedDB
                await db.users.bulkPut(users);
                set({ users, page, totalUsers: 100 }); // Assuming 100 total users for pagination
            } else {
                // Fallback to IndexedDB cache
                const users = await db.users
                    .offset((page - 1) * get().pageSize)
                    .limit(get().pageSize)
                    .toArray();
                set({ users, page });
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
