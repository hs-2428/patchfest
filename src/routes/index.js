import express from 'express';
import asyncStorageRoutes from './asyncStorage.js';

const router = express.Router();

// Enhanced health check with async validation
router.get('/health', async (req, res) => {
  try {
    res.status(200).json({ 
      ok: true, 
      message: 'Server is running with async storage',
      timestamp: new Date().toISOString(),
      async: true
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Async Storage API routes
router.use('/api/storage', asyncStorageRoutes);

// Root route with async pattern
router.get('/', async (req, res) => {
  try {
    res.json({
      message: 'PatchFest Backend API - Async Edition',
      version: '2.0.0',
      features: ['async/await', 'fs.promises', 'error handling'],
      endpoints: {
        health: '/health',
        storage: '/api/storage',
        stats: '/api/storage/stats',
        backup: '/api/storage/backup',
        docs: 'https://github.com/hs-2428/patchfest'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

export default router;