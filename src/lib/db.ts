import Dexie from 'dexie';

interface User {
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
    };
    nat: string;
    isFavorite?: boolean;
}

class UserDatabase extends Dexie {
    users!: Dexie.Table<User, string>;

    constructor() {
        super('UserDirectoryDB');

        this.version(1).stores({
            users: 'uuid, gender, name.first, name.last, email, nat, isFavorite',
        });
    }
}

export const db = new UserDatabase();
