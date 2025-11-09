// Vercel serverless function - Backend API handler
// This file handles all /api/* routes
// Vercel routes /api/* to this function, and Express receives the full path including /api

import app from "../backend/server.js";
import { Catogery } from "../backend/src/Models/catogery.model.js";
import userRoutes from '../backend/src/Routes/user.Route.js';
import adminRoutes from '../backend/src/Routes/admin.router.js';

// Routes - Use full paths /api/user and /api/admin since Vercel preserves the full URL
app.use('/api/user', userRoutes);
app.post('/api/admin/catogery', async (req, res) => {
    const { catogery } = req.body;
    const newCatogery = new Catogery({ catogery: catogery });
    await newCatogery.save();
    return res.status(200).json({
        message: "Success"
    });
});
app.use('/api/admin', adminRoutes);

// Export for Vercel serverless
export default app;

