import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { StorageInterface, DefaultCollections } from '../interfaces/storageInterface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * File-based storage adapter implementing StorageInterface
 * Uses JSON file for persistence with fs.promises for async operations
 */
export class FileStorage extends StorageInterface {
  constructor(filePath = null) {
    super();
    this.filePath = filePath || path.resolve(__dirname, '../../data/storage.json');
    this.initialized = false;
  }

  /**
   * Initialize file storage - create file and directory if needed
   */
  async init() {
    try {
      // Ensure data directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      
      // Check if file exists, create with default structure if not
      try {
        await fs.access(this.filePath);
        // File exists, validate structure
        const data = await this.read();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        if (error.code === 'ENOENT' || error.message === 'Invalid data structure') {
          // File doesn't exist or is invalid, create default structure
          await this.write(DefaultCollections);
        } else {
          throw error;
        }
      }
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize file storage: ${error.message}`);
    }
  }

  /**
   * Read complete data from JSON file
   */
  async read() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return default structure
        return DefaultCollections;
      }
      throw new Error(`Failed to read storage file: ${error.message}`);
    }
  }

  /**
   * Write complete data structure to JSON file
   */
  async write(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(this.filePath, jsonData, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write storage file: ${error.message}`);
    }
  }

  /**
   * Get all records from a collection
   */
  async getCollection(collection) {
    const data = await this.read();
    return data[collection] || [];
  }

  /**
   * Get a single record by ID from collection
   */
  async getRecord(collection, id) {
    const records = await this.getCollection(collection);
    return records.find(record => record.id === id) || null;
  }

  /**
   * Create a new record in collection
   */
  async createRecord(collection, record) {
    const data = await this.read();
    
    // Initialize collection if it doesn't exist
    if (!data[collection]) {
      data[collection] = [];
    }

    // Generate unique ID if not provided
    const id = record.id || this.generateId();
    const newRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data[collection].push(newRecord);
    await this.write(data);
    
    return newRecord;
  }

  /**
   * Update an existing record
   */
  async updateRecord(collection, id, updates) {
    const data = await this.read();
    
    if (!data[collection]) {
      return null;
    }

    const recordIndex = data[collection].findIndex(record => record.id === id);
    if (recordIndex === -1) {
      return null;
    }

    // Update record with new data
    data[collection][recordIndex] = {
      ...data[collection][recordIndex],
      ...updates,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    };

    await this.write(data);
    return data[collection][recordIndex];
  }

  /**
   * Delete a record from collection
   */
  async deleteRecord(collection, id) {
    const data = await this.read();
    
    if (!data[collection]) {
      return false;
    }

    const initialLength = data[collection].length;
    data[collection] = data[collection].filter(record => record.id !== id);
    
    if (data[collection].length === initialLength) {
      return false; // No record was deleted
    }

    await this.write(data);
    return true;
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    const data = await this.read();
    const collections = Object.keys(data);
    const totalRecords = collections.reduce((total, collection) => {
      return total + (data[collection]?.length || 0);
    }, 0);

    // Get file size
    let fileSize = 0;
    try {
      const stats = await fs.stat(this.filePath);
      fileSize = stats.size;
    } catch (error) {
      // File might not exist yet
    }

    return {
      storageType: 'file',
      totalCollections: collections.length,
      totalRecords,
      collections: collections.reduce((acc, collection) => {
        acc[collection] = data[collection]?.length || 0;
        return acc;
      }, {}),
      filePath: this.filePath,
      fileSize,
      lastModified: new Date().toISOString()
    };
  }

  /**
   * Create backup of current data
   */
  async createBackup() {
    const data = await this.read();
    const stats = await this.getStats();
    
    return {
      data,
      metadata: {
        backupCreated: new Date().toISOString(),
        storageType: 'file',
        originalPath: this.filePath,
        ...stats
      }
    };
  }

  /**
   * Clear all data (reset to default structure)
   */
  async clear() {
    await this.write(DefaultCollections);
  }

  /**
   * Health check - verify file system access
   */
  async healthCheck() {
    try {
      // Test read access
      await this.read();
      
      // Test write access with temporary data
      const testData = { ...DefaultCollections, _healthCheck: true };
      await this.write(testData);
      
      // Remove test data
      const cleanData = await this.read();
      delete cleanData._healthCheck;
      await this.write(cleanData);
      
      return true;
    } catch (error) {
      console.error('File storage health check failed:', error.message);
      return false;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}