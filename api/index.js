// Vercel serverless function - handles all /api/* routes
import app from "../backend/server.js";
import userRoutes from '../backend/src/Routes/user.Route.js';
import adminRoutes from '../backend/src/Routes/admin.router.js';
import { Catogery } from "../backend/src/Models/catogery.model.js";
import mongoose from 'mongoose';
import { dbConnect } from '../backend/src/Configs/DbConnect.js';

// Database connection middleware (for serverless cold starts)
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await dbConnect();
        } catch (error) {
            console.error('[DB]', error.message);
        }
    }
    next();
});

// Routes - Vercel strips /api, so use /user and /admin
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.post('/admin/catogery', async (req, res) => {
    try {
        const { catogery } = req.body;
        await new Catogery({ catogery }).save();
        res.json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'SnapBasket API', status: 'ok' });
});

export default app;
