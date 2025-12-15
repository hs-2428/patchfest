import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the storage file
const STORAGE_PATH = path.join(__dirname, '../../data/storage.json');

/**
 * Async JSON File Storage Layer
 * All operations are asynchronous using fs.promises
 */
class AsyncStorage {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage file asynchronously
   */
  async initializeStorage() {
    try {
      await fs.access(STORAGE_PATH);
    } catch (error) {
      // File doesn't exist, create it with initial structure
      const initialData = {
        users: [],
        posts: [],
        comments: [],
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      await this.writeData(initialData);
    }
  }

  /**
   * Async read data from storage file
   * @returns {Promise<Object>} Complete data object
   */
  async readData() {
    try {
      const data = await fs.readFile(STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, initialize and return empty structure
        await this.initializeStorage();
        return await this.readData();
      }
      throw new Error(`Failed to read storage: ${error.message}`);
    }
  }

  /**
   * Async write data to storage file
   * @param {Object} data - Complete data object to write
   */
  async writeData(data) {
    try {
      // Ensure directory exists
      const dir = path.dirname(STORAGE_PATH);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(STORAGE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Failed to write storage: ${error.message}`);
    }
  }

  /**
   * Async create a new record in specified collection
   * @param {string} collection - Collection name (users, posts, comments)
   * @param {Object} record - Record to create
   * @returns {Promise<Object>} Created record with generated ID
   */
  async create(collection, record) {
    try {
      const data = await this.readData();
      
      if (!data[collection]) {
        throw new Error(`Collection '${collection}' does not exist`);
      }

      // Generate unique ID
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newRecord = {
        id,
        ...record,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data[collection].push(newRecord);
      await this.writeData(data);
      
      return newRecord;
    } catch (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }

  /**
   * Async read records from specified collection
   * @param {string} collection - Collection name
   * @param {Object} filter - Optional filter object
   * @returns {Promise<Array>} Array of matching records
   */
  async read(collection, filter = {}) {
    try {
      const data = await this.readData();
      
      if (!data[collection]) {
        throw new Error(`Collection '${collection}' does not exist`);
      }

      let records = data[collection];

      // Apply filters if provided
      if (Object.keys(filter).length > 0) {
        records = records.filter(record => {
          return Object.keys(filter).every(key => 
            record[key] === filter[key]
          );
        });
      }

      return records;
    } catch (error) {
      throw new Error(`Failed to read records: ${error.message}`);
    }
  }

  /**
   * Async read a single record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>} Found record or null
   */
  async readById(collection, id) {
    try {
      const records = await this.read(collection, { id });
      return records.length > 0 ? records[0] : null;
    } catch (error) {
      throw new Error(`Failed to read record by ID: ${error.message}`);
    }
  }

  /**
   * Async update a record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object|null>} Updated record or null if not found
   */
  async update(collection, id, updates) {
    try {
      const data = await this.readData();
      
      if (!data[collection]) {
        throw new Error(`Collection '${collection}' does not exist`);
      }

      const recordIndex = data[collection].findIndex(record => record.id === id);
      
      if (recordIndex === -1) {
        return null; // Record not found
      }

      // Update the record
      data[collection][recordIndex] = {
        ...data[collection][recordIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.writeData(data);
      return data[collection][recordIndex];
    } catch (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }
  }

  /**
   * Async delete a record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(collection, id) {
    try {
      const data = await this.readData();
      
      if (!data[collection]) {
        throw new Error(`Collection '${collection}' does not exist`);
      }

      const initialLength = data[collection].length;
      data[collection] = data[collection].filter(record => record.id !== id);
      
      const wasDeleted = data[collection].length < initialLength;
      
      if (wasDeleted) {
        await this.writeData(data);
      }

      return wasDeleted;
    } catch (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }

  /**
   * Async get storage statistics
   * @returns {Promise<Object>} Storage statistics
   */
  async getStats() {
    try {
      const data = await this.readData();
      const stats = {
        collections: {},
        totalRecords: 0,
        storageSize: 0,
        lastUpdated: new Date().toISOString()
      };

      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          stats.collections[key] = value.length;
          stats.totalRecords += value.length;
        }
      }

      // Get file size asynchronously
      try {
        const fileStats = await fs.stat(STORAGE_PATH);
        stats.storageSize = fileStats.size;
      } catch (error) {
        stats.storageSize = 0;
      }

      return stats;
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }

  /**
   * Async backup storage to a file
   * @param {string} backupPath - Path for backup file
   * @returns {Promise<string>} Backup file path
   */
  async backup(backupPath) {
    try {
      const data = await this.readData();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const finalBackupPath = backupPath || path.join(
        path.dirname(STORAGE_PATH), 
        `storage-backup-${timestamp}.json`
      );
      
      await fs.writeFile(finalBackupPath, JSON.stringify(data, null, 2));
      return finalBackupPath;
    } catch (error) {
      throw new Error(`Failed to backup storage: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const asyncStorage = new AsyncStorage();
export default asyncStorage;