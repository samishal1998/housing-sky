import {initializeApp, cert, type App} from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { env } from "~/env";

const globalForFirebase = globalThis as unknown as {
	firebaseApp: App | undefined;
};

export const firebaseApp =
	globalForFirebase.firebaseApp ?? initializeApp({
		credential: cert({
			privateKey: env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n'),
			clientEmail: env.FIREBASE_CLIENT_EMAIL,
			projectId: env.FIREBASE_PROJECT_ID,
		}),
		serviceAccountId: env.FIREBASE_CLIENT_ID,
		projectId: env.FIREBASE_PROJECT_ID,
		storageBucket: `gs://${env.NEXT_PUBLIC_STORAGE_BUCKET}`,
	});

if (env.NODE_ENV !== "production") globalForFirebase.firebaseApp = firebaseApp




export function uploadFileFromBase64(app:App,filePath: string, data: string) {
	const bucket = getStorage(app).bucket();
	return new Promise((resolve, reject) => {
		const file = bucket.file(filePath);
		const buff = Buffer.from(data, 'base64');

		const stream = file.createWriteStream({
			metadata: {
				contentType: 'application/octet-stream',
			},
		});
		stream.on('error', (err) => {
			reject(err)
		});
		stream.on('finish', () => {
			console.log(filePath);
			resolve(filePath)
		});
		stream.end(buff);
	});
}

export function deleteFile(app:App,filePath: string) {
	const bucket = getStorage(app).bucket();

	return bucket.file(filePath).delete({ignoreNotFound:true})
}
