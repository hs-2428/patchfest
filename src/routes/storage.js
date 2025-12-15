import express from 'express';
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getStorageStats
} from '../controllers/storageController.js';

const router = express.Router();

// Storage statistics
router.get('/stats', getStorageStats);

// CRUD operations for collections
router.get('/:collection', getAllRecords);           // GET /api/storage/users
router.get('/:collection/:id', getRecordById);       // GET /api/storage/users/123
router.post('/:collection', createRecord);           // POST /api/storage/users
router.put('/:collection/:id', updateRecord);        // PUT /api/storage/users/123
router.delete('/:collection/:id', deleteRecord);     // DELETE /api/storage/users/123

export default router;