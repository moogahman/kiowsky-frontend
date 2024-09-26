import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';
import { useCart } from '../../../../hooks/useCart';

const CheckoutForm = () => {
    const { checkout } = useCart();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        // Here you would collect payment details from the user
        // For example, using CardElement
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            return;
        }

        // Create a payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error('[createPaymentMethod error]', error);
            return;
        }

        // Proceed to checkout with the created payment method
        // You might want to send `paymentMethod.id` to your backend
        // to confirm the payment intent
        await checkout();

        console.log('PaymentMethod created:', paymentMethod);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
};

export default CheckoutForm;
