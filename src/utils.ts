/**
 * Fetch and convert images to base64
 */
export async function fetchImageAsBase64(url: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn('Failed to cache image:', err);
        return undefined;
    }
}
