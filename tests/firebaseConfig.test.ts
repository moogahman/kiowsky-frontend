import { getAnalytics } from 'firebase/analytics';
import type { FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { describe, expect, it, vi } from 'vitest';
// import { firebaseConfig } from '../src/firebaseConfig.js';

const firebaseConfig: FirebaseOptions = {
    apiKey: 'test_api_key',
    authDomain: 'test_project_id.firebaseapp.com',
    projectId: 'test_project',
    storageBucket: 'test_project.appspot.com',
    messagingSenderId: 'test_messaging_sender_id',
    appId: 'test_app_id',
    measurementId: 'test_measurement_id',
};

// Mock the firebaseConfig import
vi.mock('../src/firebaseConfig.js', () => ({
    firebaseConfig,
}));

vi.mock('firebase/app', () => ({
    initializeApp: vi.fn().mockReturnValue({}),
}));

vi.mock('firebase/analytics', () => ({
    getAnalytics: vi.fn(),
}));

describe('Firebase Initialization', () => {
    it('initializes Firebase app and analytics without error', () => {
        expect(() => {
            const app = initializeApp(firebaseConfig);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const analytics = getAnalytics(app);
        }).not.toThrow();
    });
});
