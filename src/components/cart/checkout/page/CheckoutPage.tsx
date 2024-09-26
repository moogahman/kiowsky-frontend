import { useCart } from '../../../../hooks/useCart';
import CheckoutForm from '../form/CheckoutForm';

const CheckoutPage = () => {
    const { cartItems } = useCart();

    const totalAmount = cartItems.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 1);
    }, 0);

    return (
        <div>
            <h2>Checkout</h2>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <CheckoutForm />
        </div>
    );
};

export default CheckoutPage;
