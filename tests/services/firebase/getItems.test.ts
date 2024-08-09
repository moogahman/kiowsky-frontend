import { child, get, ref } from 'firebase/database';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { getItems } from '../../../src/services/firebase/getItems.js';
import type { Items } from '../../../src/types/services/firebase';

// Mock firebase methods
vi.mock('firebase/database', () => ({
    child: vi.fn(),
    get: vi.fn(),
    ref: vi.fn(),
}));

vi.mock('../../../src/config/firebaseConfig.js', () => ({
    database: {},
}));

describe('getItems', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should categorise items correctly', async () => {
        const mockItems = {
            item1: { category: 'A', name: 'Item 1', price: 5 },
            item2: { category: 'B', name: 'Item 2', price: 5 },
            item3: { category: 'A', name: 'Item 3', price: 5 },
        };

        const mockSnapshot = {
            toJSON: vi.fn().mockReturnValue(mockItems),
        };

        (ref as Mock).mockReturnValue('mockRef');
        (child as Mock).mockReturnValue('mockChild');
        (get as Mock).mockResolvedValue(mockSnapshot);

        const result = await getItems('nbcs');

        const expectedItems: Items = {
            A: [
                { category: 'A', name: 'Item 1', price: 5 },
                { category: 'A', name: 'Item 3', price: 5 },
            ],
            B: [{ category: 'B', name: 'Item 2', price: 5 }],
        };

        expect(result).toEqual(expectedItems);
    });

    it('should return undefined when no items are found', async () => {
        const mockSnapshot = {
            toJSON: vi.fn().mockReturnValue(null),
        };

        (ref as Mock).mockReturnValue('mockRef');
        (child as Mock).mockReturnValue('mockChild');
        (get as Mock).mockResolvedValue(mockSnapshot);

        const result = await getItems('nbcs');

        expect(result).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
        const mockError = new Error('Test error');

        (ref as Mock).mockReturnValue('mockRef');
        (child as Mock).mockReturnValue('mockChild');
        (get as Mock).mockRejectedValue(mockError);

        console.error = vi.fn();

        const result = await getItems('nbcs');

        expect(result).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith(
            'Error getting sidebar categories:',
            mockError
        );
    });
});
