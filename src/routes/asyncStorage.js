import express from 'express';
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getStorageStats,
  backupStorage
} from '../controllers/asyncStorageController.js';

const router = express.Router();

// Storage statistics and backup
router.get('/stats', getStorageStats);
router.post('/backup', backupStorage);

// CRUD operations for collections - all using async/await
router.get('/:collection', getAllRecords);           // GET /api/storage/users
router.get('/:collection/:id', getRecordById);       // GET /api/storage/users/123
router.post('/:collection', createRecord);           // POST /api/storage/users
router.put('/:collection/:id', updateRecord);        // PUT /api/storage/users/123
router.delete('/:collection/:id', deleteRecord);     // DELETE /api/storage/users/123

export default router;