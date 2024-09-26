import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import helmet from 'helmet';
import { env } from './config/env.js';
import { stripe } from './config/stripe.js';
import { getFileURL } from './services/getFileURL.js';
import { getItems } from './services/getItems.js';
import { verifyCode } from './services/verifyCode.js';

const app = express();

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://kiowsky.web.app',
            'https://kiowsky-kds.web.app',
            'https://kiowsky-kds.firebaseapp.com',
            'https://kiowsky.firebaseapp.com',
            /^https:\/\/kiowsky--[a-zA-Z0-9-]+\.web\.app$/,
        ],
    })
);
app.use(express.json());

// Routes
app.get('/items/:kioskId', async (req, res) => {
    try {
        const items = await getItems(req.params.kioskId);

        if (!items) {
            return res.status(404).json({ error: 'Items not found' });
        }

        return res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/file-url', async (req, res) => {
    const { url } = req.query;

    if (typeof url !== 'string') {
        return res
            .status(400)
            .json({ error: 'URL parameter is required and must be a string' });
    }

    try {
        const fileURL = await getFileURL(url);

        if (!fileURL) {
            return res.status(404).json({ error: 'File URL not found' });
        }

        return res.json({ fileURL });
    } catch (error) {
        console.error('Error fetching file URL:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/verify-code', async (req, res) => {
    const { kioskId, code } = req.body;

    if (!kioskId || !code) {
        return res.status(400).json({ error: 'kioskId and code are required' });
    }

    try {
        const isValid = await verifyCode(kioskId, code);

        return res.json({ isValid });
    } catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        console.error('Missing required parameters: amount and currency');
        return res.status(400).json({
            error: 'Missing required parameters: amount and currency',
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        return res.status(201).json(paymentIntent);
    } catch (error) {
        console.error('Error creating payment intent:', error);

        return res
            .status(500)
            .json({ error: 'Failed to create payment intent' });
    }
});

// Handle Stripe webhook events
app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            console.error('Missing Stripe signature');
            return res.status(400).send('Missing Stripe signature');
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(
                'Webhook signature verification failed:',
                error.message
            );
            return res
                .status(400)
                .send(
                    `Webhook signature verification failed: ${error.message}`
                );
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!', paymentIntent);
                // TODO: Implement post-payment fulfillment logic
                break;
            }
            default:
                console.warn(`Unhandled event type ${event.type}`);
        }

        return res.json({ received: true });
    }
);

const api = functions.region('australia-southeast1').https.onRequest(app);

if (process.env.NODE_ENV === 'development') {
    const PORT = 5001;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export { api, app };
