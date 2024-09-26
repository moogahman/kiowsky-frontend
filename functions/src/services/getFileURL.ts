import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../config/firebase.js';

/**
 * Retrieves the download URL for a file in Firebase Storage
 * @param url The storage path of the file
 * @returns Promise<string> The download URL of the file, or an empty string if an error occurs
 */
async function getFileURL(url: string): Promise<string> {
    try {
        const storageRef = ref(storage, url);

        const fileURL = await getDownloadURL(storageRef);

        return fileURL;
    } catch (error) {
        console.error('Error retrieving File URL:', error);

        return '';
    }
}

export { getFileURL };
