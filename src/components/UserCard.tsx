import { User } from '../lib/db';
import { useUserStore } from '../store/userStore';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { db } from '../lib/db';

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    const toggleFavorite = useUserStore((state) => state.toggleFavorite);
    const imgRef = useRef<HTMLImageElement>(null);
    const { fetchUsers } = useUserStore();

    useEffect(() => {
        const img = imgRef.current;
        if (!img || user.picture.largeData) return;

        const cacheImage = async () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);
                const base64Data = canvas.toDataURL('image/webp', 0.8);
                await db.users.update(user.uuid, {
                    picture: {
                        ...user.picture,
                        largeData: base64Data,
                    },
                });
            } catch (err) {
                console.warn('Image caching failed:', err);
            }
        };

        const handleLoad = () => {
            if (img.complete && img.naturalWidth > 0) {
                cacheImage();
            }
        };

        img.addEventListener('load', handleLoad);
        return () => {
            img.removeEventListener('load', handleLoad);
        };
    }, [user.uuid, fetchUsers]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg w-56">
            <div className="relative h-40 w-full">
                <Image
                    ref={imgRef}
                    src={user.picture.largeData || user.picture.large}
                    alt={`${user.name.first} ${user.name.last}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    loading="lazy"
                />
            </div>
            <div className="p-3">
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
