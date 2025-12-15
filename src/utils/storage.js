import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the storage file
const STORAGE_PATH = path.join(__dirname, '../../data/storage.json');

/**
 * JSON File Storage Layer
 * Provides CRUD operations for JSON-based data storage
 */
class JSONStorage {
  constructor() {
    this.ensureStorageExists();
  }

  /**
   * Ensure storage file exists with initial structure
   */
  async ensureStorageExists() {
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
   * Read data from storage file
   * @returns {Object} Complete data object
   */
  async readData() {
    try {
      const data = await fs.readFile(STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read storage: ${error.message}`);
    }
  }

  /**
   * Write data to storage file
   * @param {Object} data - Complete data object to write
   */
  async writeData(data) {
    try {
      await fs.writeFile(STORAGE_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Failed to write storage: ${error.message}`);
    }
  }

  /**
   * Create a new record in specified collection
   * @param {string} collection - Collection name (users, posts, comments)
   * @param {Object} record - Record to create
   * @returns {Object} Created record with generated ID
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
   * Read records from specified collection
   * @param {string} collection - Collection name
   * @param {Object} filter - Optional filter object
   * @returns {Array} Array of matching records
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
   * Read a single record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Object|null} Found record or null
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
   * Update a record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @param {Object} updates - Updates to apply
   * @returns {Object|null} Updated record or null if not found
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
   * Delete a record by ID
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {boolean} True if deleted, false if not found
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
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  async getStats() {
    try {
      const data = await this.readData();
      const stats = {
        collections: {},
        totalRecords: 0,
        storageSize: 0
      };

      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          stats.collections[key] = value.length;
          stats.totalRecords += value.length;
        }
      }

      // Get file size
      const fileStats = await fs.stat(STORAGE_PATH);
      stats.storageSize = fileStats.size;

      return stats;
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const storage = new JSONStorage();
export default storage;