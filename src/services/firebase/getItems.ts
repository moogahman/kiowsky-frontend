import { child, get, ref } from 'firebase/database';
import { database } from '../../config/firebaseConfig.js';
import type { Item, Items } from '../../types/services/firebase';

await getItems('nbcs');

/**
 * Returns an object with items sorted into the categories
 * @param kioskId The Kiosk ID
 * @returns Promise<Items | undefined>
 */
async function getItems(kioskId: string): Promise<Items | undefined> {
    try {
        const dbRef = ref(database);

        const snapshot = await get(child(dbRef, `kiosks/${kioskId}/items`));

        // Snapshot object to JSON
        const databaseItems = snapshot.toJSON();

        if (!databaseItems) {
            console.error('No items found in database');
            return undefined;
        }

        const items: Items = {};

        // Iterate through the items object and categorize them
        Object.values(databaseItems).forEach((item: Item) => {
            const category = item.category;

            // If the category is not already a key in "items" add it
            if (!items[category]) {
                items[category] = [];
            }

            items[category].push(item);
        });

        return items;
    } catch (error) {
        console.error('Error getting sidebar categories:', error);
    }
}

export { getItems };
