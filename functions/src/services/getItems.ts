import { child, get, ref } from 'firebase/database';
import {
    getDownloadURL,
    getStorage,
    ref as storageRef,
} from 'firebase/storage';
import type { CategoryMenuData, MenuItemData } from '../../../types/index.js';
import { database } from '../config/firebase.js';

/**
 * Returns an object with items sorted into the categories
 * @param kioskId The Kiosk ID
 * @returns Promise<CategoryMenuData | undefined>
 */
async function getItems(kioskId: string): Promise<CategoryMenuData> {
    try {
        const dbRef = ref(database);
        const storage = getStorage();

        const snapshot = await get(child(dbRef, `kiosks/${kioskId}/items`));
        const databaseItems = snapshot.val();

        if (!databaseItems) {
            console.error('No items found in database');
            return {};
        }

        const items: CategoryMenuData = {};
        const imagePromises: Promise<void>[] = [];

        for (const [itemId, item] of Object.entries(databaseItems)) {
            const typedItem = item as MenuItemData;
            const category = typedItem.category;

            // If the category is not already a key in "items" add it
            if (!items[category]) {
                items[category] = [];
            }

            items[category].push(typedItem);

            const imagePromise = (async () => {
                try {
                    const imageRef = storageRef(
                        storage,
                        `kiosks/${kioskId}/images/items/${itemId}.webp`
                    );
                    typedItem.image = await getDownloadURL(imageRef);
                } catch (error) {
                    console.error(
                        `Error fetching image for item ${itemId}:`,
                        error
                    );
                    typedItem.image = '';
                }
            })();

            imagePromises.push(imagePromise);
        }

        await Promise.all(imagePromises); // Wait for all image promises to resolve

        return items;
    } catch (error) {
        console.error('Error getting items:', error);
        return {};
    }
}

export { getItems };
