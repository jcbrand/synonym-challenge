import Dexie, { type Table } from 'dexie';

export interface User {
    uuid: string;
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
        largeData?: string;
    };
    nat: string;
    isFavorite?: boolean;
    lastUpdated?: number;
}

class UserDatabase extends Dexie {
    users!: Table<User>;

    constructor() {
        super('UserDirectoryDB');

        // Schema versions and migrations
        this.version(1).stores({
            users: 'uuid, gender, name.first, name.last, email, nat, isFavorite',
        });

        this.version(2)
            .stores({
                users: 'uuid, gender, name.first, name.last, email, nat, isFavorite, lastUpdated',
            })
            .upgrade(async (tx) => {
                await tx
                    .table('users')
                    .toCollection()
                    .modify((user) => {
                        user.lastUpdated = Date.now();
                    });
            });

        this.version(3).stores({
            users: 'uuid, gender, name.first, name.last, email, nat, isFavorite, lastUpdated, &[email+nat]',
        });
    }

    // Helper method to clear and repopulate data
    async seedUsers(users: User[]) {
        return this.transaction('rw', this.users, async () => {
            await this.users.clear();
            await this.users.bulkAdd(users);
        });
    }
}

export const db = new UserDatabase();

// Type-safe accessor
export const userTable = db.users;
