// TO-DO: Integrate auth with login screen

import { child, get, ref } from 'firebase/database';
import { database } from '../config/firebase.js';

/**
 * Verifies the provided code for a given kiosk
 * @param kioskId The Kiosk ID
 * @param code The code to verify
 * @returns Promise<boolean> True if the code is valid, false otherwise
 */
async function verifyCode(kioskId: string, code: string): Promise<boolean> {
    const dbRef = ref(database);

    try {
        const snapshot = await get(child(dbRef, `kiosks/${kioskId}/code`));

        const snapshotCode = snapshot.val() as string;

        if (snapshotCode === code) {
            // If code exists, setup the kiosk

            return true;
        } else {
            // Code does not exist, throw error

            return false;
        }
    } catch (error) {
        throw new Error('Error verifying code: ' + error);
    }
}

export { verifyCode };
