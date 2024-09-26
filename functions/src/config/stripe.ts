import Stripe from 'stripe';
import { env } from './env.js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

export { stripe };
