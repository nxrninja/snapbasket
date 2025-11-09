// Vercel serverless function - Backend API handler
// This file handles all /api/* routes
// IMPORTANT: Vercel routes /api/* to this function

import app from "../backend/server.js";
import { Catogery } from "../backend/src/Models/catogery.model.js";
import userRoutes from '../backend/src/Routes/user.Route.js';
import adminRoutes from '../backend/src/Routes/admin.router.js';
import { dbConnect } from '../backend/src/Configs/DbConnect.js';

// Ensure database is connected on each request (serverless cold starts)
app.use(async (req, res, next) => {
    try {
        // Try to connect if not connected
        if (mongoose.connection.readyState !== 1) {
            await dbConnect();
        }
    } catch (error) {
        console.error('Database connection error:', error.message);
        // Continue anyway - some routes might not need DB
    }
    next();
});

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.path}`, {
        originalUrl: req.originalUrl,
        url: req.url,
        baseUrl: req.baseUrl
    });
    next();
});

// Routes - Handle both /api/user and /user patterns
// Vercel might preserve /api or strip it, so we handle both
app.use('/api/user', userRoutes);
app.use('/user', userRoutes);

app.post('/api/admin/catogery', async (req, res) => {
    const { catogery } = req.body;
    const newCatogery = new Catogery({ catogery: catogery });
    await newCatogery.save();
    return res.status(200).json({
        message: "Success"
    });
});
app.post('/admin/catogery', async (req, res) => {
    const { catogery } = req.body;
    const newCatogery = new Catogery({ catogery: catogery });
    await newCatogery.save();
    return res.status(200).json({
        message: "Success"
    });
});

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'SnapBasket API is running', path: req.path });
});
app.get('/', (req, res) => {
    res.json({ message: 'SnapBasket API is running', path: req.path });
});

// Export for Vercel serverless
export default app;
