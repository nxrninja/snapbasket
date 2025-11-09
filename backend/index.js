import app from "./server.js";
import { Catogery } from "./src/Models/catogery.model.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

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

// Serve static files from frontend/dist
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return next();
    }
    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 8443;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend served from: ${frontendDistPath}`);
});
