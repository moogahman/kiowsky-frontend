import axios from 'axios';
import { useEffect, useState } from 'react';

import type { Item, Items } from '../../types/services/firebase';
import './sidebar.css';
import Tab from './tabs/tab';

const Sidebar: React.FC = () => {
    const [items, setItems] = useState<[string, Item[]][] | null>(null);

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/items/nbcs'
                );
                const fetchedItems = response.data as Items;

                if (!fetchedItems) {
                    return console.log(
                        'No items found for the given kiosk ID.'
                    );
                }

                const items = Object.entries(fetchedItems);

                console.log(items);

                setItems(items);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }

        fetchItems();
    }, []);

    /* return (
        <div className="sidebar">
            <div>
                <img src="https://via.placeholder.com/150" alt="profile" />
            </div>
            <Tab title="Drinks" link="/drinks" Icon={RiDrinksFill} />
            <Tab title="Hot Food" link="/hotfood" Icon={BiSolidBowlHot} />
            <Tab title="Snacks" link="/snacks" Icon={FaBowlFood} />
            <Tab title="Cold Food" link="/coldfood" Icon={FaCheese} />
            <div>
                <h4 className="powered-by">Powered by</h4>
                <img
                    alt="Kiowsky logo"
                    src="./img/Logo-text.png"
                    className="logo-text"
                />
            </div>
        </div>
    ); */

    return (
        <div className="sidebar">
            <div>
                <img src="https://via.placeholder.com/150" alt="profile" />
            </div>
            {items ? (
                items.map((item, index) => {
                    const link = item[0]
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, '');

                    return (
                        <Tab
                            key={index}
                            title={item[0]}
                            link={link}
                            // Icon={item[1].icon}
                        />
                    );
                })
            ) : (
                <p>Loading items...</p>
            )}
            <div>
                <h4 className="powered-by">Powered by</h4>
                <img
                    alt="Kiowsky logo"
                    src="./img/Logo-text.png"
                    className="logo-text"
                />
            </div>
        </div>
    );
};

export default Sidebar;
