import { storageManager } from '../utils/storageFactory.js';

/**
 * Modern Storage Controller using Storage Adapter Pattern
 * Supports file-based and in-memory storage through unified interface
 */

// Get all records from a collection
export const getAllRecords = async (req, res) => {
  try {
    const { collection } = req.params;
    const storage = storageManager.getStorage();
    
    // Validate collection name
    if (!collection || typeof collection !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid collection name'
      });
    }
    
    const records = await storage.getCollection(collection);
    
    res.status(200).json({
      success: true,
      data: records,
      count: records.length,
      collection: collection,
      storageType: (await storage.getStats()).storageType
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
export const getRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const storage = storageManager.getStorage();
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    const record = await storage.getRecord(collection, id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Record with ID '${id}' not found in collection '${collection}'`
      });
    }
    
    res.status(200).json({
      success: true,
      data: record,
      collection: collection
    });
  } catch (error) {
    console.error('Error getting record:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      operation: 'get_record'
    });
  }
};

// Create a new record
export const createRecord = async (req, res) => {
  try {
    const { collection } = req.params;
    const recordData = req.body;
    const storage = storageManager.getStorage();
    
    // Validate collection name
    if (!collection || typeof collection !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid collection name'
      });
    }
    
    // Validate record data
    if (!recordData || typeof recordData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Valid record data is required'
      });
    }
    
    const newRecord = await storage.createRecord(collection, recordData);
    
    res.status(201).json({
      success: true,
      data: newRecord,
      message: `Record created in collection '${collection}'`,
      collection: collection
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

// Update an existing record
export const updateRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updates = req.body;
    const storage = storageManager.getStorage();
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    // Validate update data
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Valid update data is required'
      });
    }
    
    const updatedRecord = await storage.updateRecord(collection, id, updates);
    
    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        error: `Record with ID '${id}' not found in collection '${collection}'`
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedRecord,
      message: `Record updated in collection '${collection}'`,
      collection: collection
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

// Delete a record
export const deleteRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const storage = storageManager.getStorage();
    
    // Validate parameters
    if (!collection || !id) {
      return res.status(400).json({
        success: false,
        error: 'Collection and ID are required'
      });
    }
    
    const deleted = await storage.deleteRecord(collection, id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Record with ID '${id}' not found in collection '${collection}'`
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Record deleted from collection '${collection}'`,
      deletedId: id,
      collection: collection
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
export const getStats = async (req, res) => {
  try {
    const storage = storageManager.getStorage();
    const stats = await storage.getStats();
    
    res.status(200).json({
      success: true,
      data: stats,
      message: 'Storage statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting stats:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      operation: 'get_stats'
    });
  }
};

// Create backup
export const createBackup = async (req, res) => {
  try {
    const storage = storageManager.getStorage();
    const backup = await storage.createBackup();
    
    res.status(200).json({
      success: true,
      data: backup,
      message: 'Backup created successfully'
    });
  } catch (error) {
    console.error('Error creating backup:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      operation: 'create_backup'
    });
  }
};

// Health check for storage
export const healthCheck = async (req, res) => {
  try {
    const storage = storageManager.getStorage();
    const isHealthy = await storage.healthCheck();
    const stats = await storage.getStats();
    
    if (isHealthy) {
      res.status(200).json({
        success: true,
        healthy: true,
        storageType: stats.storageType,
        message: 'Storage is healthy and accessible'
      });
    } else {
      res.status(503).json({
        success: false,
        healthy: false,
        storageType: stats.storageType,
        message: 'Storage health check failed'
      });
    }
  } catch (error) {
    console.error('Error in storage health check:', error.message);
    res.status(503).json({
      success: false,
      healthy: false,
      error: error.message,
      operation: 'health_check'
    });
  }
};

// Clear all data (development/testing only)
export const clearStorage = async (req, res) => {
  try {
    // Safety check - only allow in development/test environments
    const env = process.env.NODE_ENV;
    if (env === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Clear operation not allowed in production environment'
      });
    }
    
    const storage = storageManager.getStorage();
    await storage.clear();
    
    res.status(200).json({
      success: true,
      message: 'Storage cleared successfully',
      environment: env || 'development'
    });
  } catch (error) {
    console.error('Error clearing storage:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      operation: 'clear_storage'
    });
  }
};