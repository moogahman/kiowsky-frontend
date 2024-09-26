import { useEffect, useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import type { MenuItemData } from '../../../types';
import { useCart } from '../../hooks/useCart'; // Import the cart context
import './detail.css';

const defaultImage = '/img/noImage.png';

function Detail() {
    const [quantity, setQuantity] = useState(1);
    const [item, setItem] = useState<MenuItemData | null>(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { category, itemId } = useParams<{
        category: string;
        itemId: string;
    }>();

    const displayImage = item?.image ? item?.image : defaultImage;

    useEffect(() => {
        if (!category || !itemId) return;

        const cachedItems = localStorage.getItem(`${category}Items`);
        if (!cachedItems) return;

        const items: MenuItemData[] = JSON.parse(cachedItems);

        const selectedItem = items.find(item => item.name === itemId);
        if (!selectedItem) return;

        setItem(selectedItem);
    }, [category, itemId]);

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleAddToCart = () => {
        if (item) {
            addToCart({ ...item, quantity });
        }
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-2">
            <h1 className="title">
                {item.name} <h3 className="price">AUD${item.price}</h3>
            </h1>
            <IoIosCloseCircle
                size={37}
                className="close-icon"
                onClick={handleClose}
            />
            <div className="img-main">
                <img
                    src={displayImage}
                    alt={item.name}
                    className="detail-img"
                />
            </div>
            <div className="quantity-contain">
                <div className="quantity-count">
                    <div className="minus-btn" onClick={handleDecrement}>
                        -
                    </div>
                    <h1 className="quantity-num">{quantity}</h1>
                    <div className="plus-btn" onClick={handleIncrement}>
                        +
                    </div>
                </div>
            </div>
            <div className="cart-btn" onClick={handleAddToCart}>
                <h1 className="cart-btn-txt">Add to cart</h1>
            </div>
        </div>
    );
}

export default Detail;
