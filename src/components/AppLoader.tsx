import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryMenuData } from '../../types';
import './AppLoader.css';

const API_BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_LOCALHOST_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL;

function AppLoader({ children }: AppLoaderProps) {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAndCacheData() {
            try {
                const response = await fetch(`${API_BASE_URL}/items/nbcs`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const fetchedItems =
                    (await response.json()) as CategoryMenuData;

                if (!fetchedItems) {
                    console.log('No items found for the given kiosk ID.');
                    return;
                }

                // Extract categories and items from the fetched data
                const categories = Object.keys(fetchedItems);

                const allItems = categories.flatMap(
                    category => fetchedItems[category]
                );

                setTotalAssets(allItems.length);

                // Wait for state update to complete
                await new Promise(resolve => setTimeout(resolve, 0));

                // Preload images for all items
                for (let i = 0; i < allItems.length; i++) {
                    const item = allItems[i];

                    if (!item) return;

                    if (item.image) {
                        await preloadImage(item.image);
                    }

                    setProgress(i + 1);
                    // Wait for progress update to be reflected
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

                // Cache categories in localStorage
                for (const category of categories) {
                    localStorage.setItem(
                        `${category}Items`,
                        JSON.stringify(fetchedItems[category])
                    );
                }

                // Cache sidebar items in localStorage
                localStorage.setItem(
                    'sidebarItems',
                    JSON.stringify(Object.entries(fetchedItems))
                );

                // Navigate to the first tab's route
                if (categories.length > 0 && loading) {
                    const firstCategory = categories[0]
                        ?.trim()
                        ?.toLowerCase()
                        ?.replace(/\s+/g, '-');
                    navigate(`/${firstCategory}`);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching and caching data:', error);
                setLoading(false);
            }
        }

        fetchAndCacheData();
    }, [navigate]);

    // Function to preload an image
    const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve();
            img.onerror = reject;
            img.src = src;
        });
    };

    // Display loading screen while assets are being loaded
    if (loading) {
        return (
            <div className="loading-screen">
                <h2>
                    {progress === 0 && totalAssets === 0
                        ? 'Loading assets'
                        : `Loading assets (${progress}/${totalAssets})`}
                </h2>
                <progress value={progress} max={totalAssets}></progress>
            </div>
        );
    }

    return <>{children}</>;
}

export default AppLoader;

interface AppLoaderProps {
    children: React.ReactNode;
}
