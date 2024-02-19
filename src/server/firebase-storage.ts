import {initializeApp, cert, App} from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from '~/../config/housing-sky-firebase-adminsdk-lg130-296b0c1d13.json';

import { env } from "~/env";

const globalForFirebase = globalThis as unknown as {
	firebaseApp: App | undefined;
};

export const firebaseApp =
	globalForFirebase.firebaseApp ?? initializeApp({
		credential: cert({
			privateKey: serviceAccount.private_key,
			clientEmail: serviceAccount.client_email,
			projectId: serviceAccount.project_id,
		}),
		serviceAccountId: serviceAccount.client_id,
		projectId: serviceAccount.project_id,
		storageBucket: 'gs://housing-sky.appspot.com',
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
