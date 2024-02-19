import {env} from "~/env";

const bucket = env.NEXT_PUBLIC_STORAGE_BUCKET;
const token = env.NEXT_PUBLIC_STORAGE_READ_TOKEN;
export const getPublicImageUrlFromPath = (path: string) => {
    const url = new URL(
        `/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(path)}`,
        'https://firebasestorage.googleapis.com',
    );
    url.searchParams.append('alt', 'media');
    url.searchParams.append('token', token);
    return url.toString();
};
