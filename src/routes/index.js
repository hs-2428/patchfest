import express from 'express';
import storageRoutes from './storage.js';
import { storageManager, StorageFactory } from '../utils/storageFactory.js';

const router = express.Router();

// Enhanced health check with storage adapter info
router.get('/health', async (req, res) => {
  try {
    // Get storage info
    const storage = storageManager.getStorage();
    const storageStats = await storage.getStats();
    const storageHealthy = await storage.healthCheck();
    
    res.status(200).json({ 
      ok: true, 
      message: 'Server is running with storage adapter pattern',
      timestamp: new Date().toISOString(),
      storage: {
        type: storageStats.storageType,
        healthy: storageHealthy,
        adapter: 'Unified Storage Interface'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Storage API routes with adapter pattern
router.use('/api/storage', storageRoutes);

// Root route with storage adapter info
router.get('/', async (req, res) => {
  try {
    const storageConfig = StorageFactory.getConfig();
    
    res.json({
      message: 'PatchFest Backend API - Storage Adapter Edition',
      version: '3.0.0',
      features: [
        'Storage Adapter Pattern',
        'Environment-based Storage Selection', 
        'File & Memory Storage',
        'Unified Storage Interface',
        'async/await',
        'Comprehensive Error Handling'
      ],
      storage: {
        type: storageConfig.detectedType,
        environment: storageConfig.nodeEnv,
        availableTypes: storageConfig.availableTypes
      },
      endpoints: {
        health: '/health',
        storage: '/api/storage',
        storageHealth: '/api/storage/health',
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