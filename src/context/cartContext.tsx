import { loadStripe, type Stripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { MenuItemData } from '../../types';

const API_BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_LOCALHOST_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL;

interface CartContextType {
    cartItems: MenuItemData[];
    addToCart: (item: MenuItemData) => void;
    removeFromCart: (itemId: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    checkout: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<MenuItemData[]>(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: MenuItemData) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.name === item.name);
            if (existingItem) {
                return prevItems.map(i =>
                    i.name === item.name
                        ? {
                              ...i,
                              quantity:
                                  (i.quantity || 0) + (item.quantity || 1),
                          }
                        : i
                );
            }
            return [...prevItems, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        console.log(`Updating item ${itemId} to quantity ${quantity}`);
        if (!itemId) {
            console.error('itemId is undefined or null');
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const checkout = async () => {
        try {
            // Calculate total amount in cents
            const totalAmount =
                cartItems.reduce((sum, item) => {
                    return sum + (item.price || 0) * (item.quantity || 1);
                }, 0) * 100;

            // Send request to backend to create payment intent
            const response = await fetch(
                `${API_BASE_URL}/create-payment-intent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: totalAmount,
                        currency: 'AUD', // Change as needed
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Failed to create payment intent'
                );
            }

            console.log(data);

            const clientSecret = data.clientSecret;

            // Initialize Stripe.js
            const stripe: Stripe | null = await loadStripe(
                import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
            );

            if (!stripe) {
                throw new Error('Stripe failed to load');
            }

            // Here, you would typically use Stripe Elements to collect payment details
            // and confirm the payment. For simplicity, this example assumes that the
            // payment details are collected elsewhere and that you have access to a
            // CardElement or similar.

            // Example: This requires you to have a CardElement in your component
            // and pass it to the checkout function or manage it within the context.

            // Since managing Stripe Elements within context can be complex,
            // it's recommended to handle payment confirmation within a dedicated
            // Checkout component.

            console.log('Payment Intent created:', clientSecret);

            // Clear the cart upon successful payment creation
            setCartItems([]);
        } catch (error) {
            console.error('Checkout failed:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateItemQuantity,
                checkout,
            }}>
            {children}
        </CartContext.Provider>
    );
};
