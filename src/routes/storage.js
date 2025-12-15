import express from 'express';
import {
  getAllRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getStats,
  createBackup,
  healthCheck,
  clearStorage
} from '../controllers/storageController.js';

const router = express.Router();

// Storage health check endpoint
router.get('/health', healthCheck);

// Storage statistics endpoint
router.get('/stats', getStats);

// Backup endpoint
router.get('/backup', createBackup);

// Clear storage endpoint (development/testing only)
router.delete('/clear', clearStorage);

// Collection-based CRUD operations
router.get('/:collection', getAllRecords);
router.post('/:collection', createRecord);

// Record-based operations with ID
router.get('/:collection/:id', getRecord);
router.put('/:collection/:id', updateRecord);
router.delete('/:collection/:id', deleteRecord);

export default router;