import express from 'express';
import storageRoutes from './storage.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    ok: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Storage API routes
router.use('/api/storage', storageRoutes);

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'PatchFest Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      storage: '/api/storage',
      docs: 'https://github.com/hs-2428/patchfest'
    }
  });
});

export default router;