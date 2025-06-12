import { User } from '../lib/db';
import { useUserStore } from '../store/userStore';
import Image from 'next/image';

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    const toggleFavorite = useUserStore((state) => state.toggleFavorite);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-48 w-full">
                <Image
                    src={user.picture.largeData || user.picture.large}
                    alt={`${user.name.first} ${user.name.last}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={!!user.picture.largeData} // Disable optimization for Base64 images
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.name.title} {user.name.first} {user.name.last}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.nat} • {user.gender}
                        </p>
                    </div>
                    <button
                        onClick={() => toggleFavorite(user.uuid)}
                        className="text-2xl focus:outline-none"
                        aria-label={user.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {user.isFavorite ? '★' : '☆'}
                    </button>
                </div>
            </div>
        </div>
    );
}
