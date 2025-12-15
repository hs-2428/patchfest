import { StorageInterface, DefaultCollections } from '../interfaces/storageInterface.js';

/**
 * In-memory storage adapter implementing StorageInterface
 * Uses JavaScript objects for fast, temporary storage
 * Data is lost when the application restarts
 */
export class MemoryStorage extends StorageInterface {
  constructor() {
    super();
    this.data = {};
    this.initialized = false;
    this.createdAt = new Date().toISOString();
  }

  /**
   * Initialize memory storage with default structure
   */
  async init() {
    this.data = { ...DefaultCollections };
    this.initialized = true;
  }

  /**
   * Read complete data from memory
   */
  async read() {
    return { ...this.data };
  }

  /**
   * Write complete data structure to memory
   */
  async write(data) {
    this.data = { ...data };
  }

  /**
   * Get all records from a collection
   */
  async getCollection(collection) {
    return [...(this.data[collection] || [])];
  }

  /**
   * Get a single record by ID from collection
   */
  async getRecord(collection, id) {
    const records = this.data[collection] || [];
    const record = records.find(record => record.id === id);
    return record ? { ...record } : null;
  }

  /**
   * Create a new record in collection
   */
  async createRecord(collection, record) {
    // Initialize collection if it doesn't exist
    if (!this.data[collection]) {
      this.data[collection] = [];
    }

    // Generate unique ID if not provided
    const id = record.id || this.generateId();
    const newRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data[collection].push(newRecord);
    
    return { ...newRecord };
  }

  /**
   * Update an existing record
   */
  async updateRecord(collection, id, updates) {
    if (!this.data[collection]) {
      return null;
    }

    const recordIndex = this.data[collection].findIndex(record => record.id === id);
    if (recordIndex === -1) {
      return null;
    }

    // Update record with new data
    this.data[collection][recordIndex] = {
      ...this.data[collection][recordIndex],
      ...updates,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    };

    return { ...this.data[collection][recordIndex] };
  }

  /**
   * Delete a record from collection
   */
  async deleteRecord(collection, id) {
    if (!this.data[collection]) {
      return false;
    }

    const initialLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(record => record.id !== id);
    
    return this.data[collection].length < initialLength;
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    const collections = Object.keys(this.data);
    const totalRecords = collections.reduce((total, collection) => {
      return total + (this.data[collection]?.length || 0);
    }, 0);

    // Calculate memory usage estimate
    const dataString = JSON.stringify(this.data);
    const memoryUsage = Buffer.byteLength(dataString, 'utf8');

    return {
      storageType: 'memory',
      totalCollections: collections.length,
      totalRecords,
      collections: collections.reduce((acc, collection) => {
        acc[collection] = this.data[collection]?.length || 0;
        return acc;
      }, {}),
      memoryUsage,
      createdAt: this.createdAt,
      lastModified: new Date().toISOString(),
      persistent: false,
      warning: 'Data will be lost when application restarts'
    };
  }

  /**
   * Create backup of current data
   */
  async createBackup() {
    const stats = await this.getStats();
    
    return {
      data: { ...this.data },
      metadata: {
        backupCreated: new Date().toISOString(),
        storageType: 'memory',
        ...stats
      }
    };
  }

  /**
   * Clear all data (reset to default structure)
   */
  async clear() {
    this.data = { ...DefaultCollections };
  }

  /**
   * Health check - verify memory access
   */
  async healthCheck() {
    try {
      // Test basic operations
      const testCollection = '_healthTest';
      const testRecord = { name: 'health-check', timestamp: Date.now() };
      
      // Create test record
      const created = await this.createRecord(testCollection, testRecord);
      if (!created || !created.id) {
        return false;
      }
      
      // Read test record
      const read = await this.getRecord(testCollection, created.id);
      if (!read || read.name !== testRecord.name) {
        return false;
      }
      
      // Update test record
      const updated = await this.updateRecord(testCollection, created.id, { status: 'updated' });
      if (!updated || updated.status !== 'updated') {
        return false;
      }
      
      // Delete test record
      const deleted = await this.deleteRecord(testCollection, created.id);
      if (!deleted) {
        return false;
      }
      
      // Clean up test collection
      delete this.data[testCollection];
      
      return true;
    } catch (error) {
      console.error('Memory storage health check failed:', error.message);
      return false;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current memory state (for debugging)
   */
  getMemoryState() {
    return {
      initialized: this.initialized,
      dataSize: Object.keys(this.data).length,
      collections: Object.keys(this.data),
      recordCounts: Object.keys(this.data).reduce((acc, collection) => {
        acc[collection] = this.data[collection]?.length || 0;
        return acc;
      }, {})
    };
  }
}