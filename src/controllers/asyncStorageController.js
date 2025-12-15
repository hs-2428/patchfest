import asyncStorage from '../utils/asyncStorage.js';

/**
 * Async Storage Controller
 * All routes use async/await patterns with comprehensive error handling
 */

// Get all records from a collection
export const getAllRecords = async (req, res) => {
  try {
    const { collection } = req.params;
    const filter = req.query || {};
    
    // Validate collection name
    if (!collection || typeof collection !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid collection name'
      });
    }
    
    const records = await asyncStorage.read(collection, filter);
    
    res.status(200).json({
      success: true,
      data: records,
      count: records.length,
      collection: collection
    });
  } catch (error) {
    console.error('Error getting records:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'get_all_records'
    });
  }
};

// Get a single record by ID
export const getRecordById = async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    const record = await asyncStorage.readById(collection, id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
        collection: collection,
        id: id
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error getting record by ID:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'get_record_by_id'
    });
  }
};

// Create a new record
export const createRecord = async (req, res) => {
  try {
    const { collection } = req.params;
    const recordData = req.body;
    
    // Validate collection
    if (!collection) {
      return res.status(400).json({
        success: false,
        error: 'Collection name is required'
      });
    }
    
    // Validate request body
    if (!recordData || Object.keys(recordData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body with data is required'
      });
    }
    
    const newRecord = await asyncStorage.create(collection, recordData);
    
    res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Record created successfully'
    });
  } catch (error) {
    console.error('Error creating record:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'create_record'
    });
  }
};

// Update a record by ID
export const updateRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updates = req.body;
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    // Validate update data
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Update data is required'
      });
    }
    
    // Prevent updating system fields
    delete updates.id;
    delete updates.createdAt;
    
    const updatedRecord = await asyncStorage.update(collection, id, updates);
    
    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
        collection: collection,
        id: id
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedRecord,
      message: 'Record updated successfully'
    });
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'update_record'
    });
  }
};

// Delete a record by ID
export const deleteRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    const wasDeleted = await asyncStorage.delete(collection, id);
    
    if (!wasDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Record not found',
        collection: collection,
        id: id
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting record:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'delete_record'
    });
  }
};

// Get storage statistics
export const getStorageStats = async (req, res) => {
  try {
    const stats = await asyncStorage.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting storage stats:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      operation: 'get_storage_stats'
    });
  }
};

// Backup storage
export const backupStorage = async (req, res) => {
  try {
    const { backupPath } = req.body;
    
    const backupFile = await asyncStorage.backup(backupPath);
    
    res.status(200).json({
      success: true,
      message: 'Storage backup created successfully',
      backupPath: backupFile
    });
  } catch (error) {
    console.error('Error creating backup:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      operation: 'backup_storage'
    });
  }
};