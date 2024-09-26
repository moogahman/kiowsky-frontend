import { FaTrash } from 'react-icons/fa';
import { useCart } from '../../../hooks/useCart';
import type { CartItemProps } from '../../../types';
import './cartItem.css';

function CartItem({
    name,
    imgLink,
    imgAlt,
    title,
    quantity,
    price,
}: CartItemProps) {
    const { removeFromCart, updateItemQuantity } = useCart();

    const handleRemove = () => {
        removeFromCart(name);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0) {
            updateItemQuantity(name, newQuantity);
        } else {
            removeFromCart(name);
        }
    };

    return (
        <div className="cart-item">
            <img src={imgLink} alt={imgAlt} />
            <h2>{title}</h2>
            <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(quantity - 1)}>
                    -
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(quantity + 1)}>
                    +
                </button>
            </div>
            <h2 className="cart-item-price">${Number(price.toFixed(2))}</h2>
            <button className="remove-button" onClick={handleRemove}>
                <FaTrash />
                <span>Remove</span>
            </button>
        </div>
    );
}

export default CartItem;
