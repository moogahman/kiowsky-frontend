import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import helmet from 'helmet';
import { getFileURL } from './services/getFileURL.js';
import { getItems } from './services/getItems.js';
import { verifyCode } from './services/verifyCode.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
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
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/file-url', async (req, res) => {
    const { url } = req.query;

    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const fileURL = await getFileURL(url);

        if (!fileURL) {
            return res.status(404).json({ error: 'File URL not found' });
        }

        return res.json({ fileURL });
    } catch (error) {
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
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// if (process.env.NODE_ENV === 'development') {
//     ViteExpress.config({ mode: 'development' });

//     ViteExpress.listen(app, 3000, () =>
//         console.log('Server is listening on port 3000...')
//     );
// }

const api = functions.region('australia-southeast1').https.onRequest(app);

export { api, app };