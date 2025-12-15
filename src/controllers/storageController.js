import storage from '../utils/storage.js';

/**
 * Storage Controller
 * Handles API requests for data storage operations
 */

// Get all records from a collection
export const getAllRecords = async (req, res) => {
  try {
    const { collection } = req.params;
    const filter = req.query || {};
    
    const records = await storage.read(collection, filter);
    
    res.status(200).json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single record by ID
export const getRecordById = async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    const record = await storage.readById(collection, id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new record
export const createRecord = async (req, res) => {
  try {
    const { collection } = req.params;
    const recordData = req.body;
    
    if (!recordData || Object.keys(recordData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required'
      });
    }
    
    const newRecord = await storage.create(collection, recordData);
    
    res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Record created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a record by ID
export const updateRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updates = req.body;
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Update data is required'
      });
    }
    
    const updatedRecord = await storage.update(collection, id, updates);
    
    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedRecord,
      message: 'Record updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a record by ID
export const deleteRecord = async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    const wasDeleted = await storage.delete(collection, id);
    
    if (!wasDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get storage statistics
export const getStorageStats = async (req, res) => {
  try {
    const stats = await storage.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};