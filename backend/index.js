import app from "./server.js";
import { Catogery } from "./src/Models/catogery.model.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import Routes Path
import userRoutes from './src/Routes/user.Route.js';
import adminRoutes from './src/Routes/admin.router.js'

// Routes
app.use('/api/user', userRoutes);
app.post('/api/admin/catogery' , async (req , res) => {
    const {catogery} = req.body;

    const newCatogery = new Catogery({catogery: catogery})
  await  newCatogery.save();
  

  return res.status(200).json({
    message: "Success"
  })

})

app.use('/api/admin' , adminRoutes )

// Serve static files from frontend/dist (if it exists)
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');

if (existsSync(frontendDistPath)) {
    console.log(`Serving frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Handle React Router - serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api')) {
            return next();
        }
        // Serve index.html for all other routes (SPA routing)
        const indexPath = path.join(frontendDistPath, 'index.html');
        if (existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).json({ error: 'Frontend not built. Please build the frontend first.' });
        }
    });
} else {
    console.warn(`Frontend dist not found at: ${frontendDistPath}`);
    console.warn('Server will run but frontend will not be served. Build frontend first.');
    
    // Fallback route for non-API requests
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.status(503).json({ 
            error: 'Frontend not available', 
            message: 'Please build the frontend: npm run build --prefix frontend' 
        });
    });
}

// Use PORT from environment (Sevalla provides this, defaults to 8443 for local)
const PORT = process.env.PORT || 8443;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Listening on: 0.0.0.0:${PORT}`);
    if (existsSync(frontendDistPath)) {
        console.log(`📦 Frontend served from: ${frontendDistPath}`);
    }
});
