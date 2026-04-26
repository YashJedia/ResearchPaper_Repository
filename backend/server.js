import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import facultyRoutes from './routes/faculty.js';
import paperRoutes from './routes/paper.js';
import facultyAuthRoutes from './routes/facultyAuth.js';
import adminFacultyRoutes from './routes/adminFaculty.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://research-paper-repository-seven.vercel.app',
    'https://researchpaper-repository-backend.onrender.com'
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/faculty-auth', facultyAuthRoutes);
app.use('/api/admin/faculty', adminFacultyRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve frontend static files (after API and error middleware)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Catch-all: serve index.html for client-side routing (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
