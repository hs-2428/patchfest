/**
 * Abstract Storage Interface
 * 
 * Defines the contract that all storage adapters must implement.
 * This enables easy switching between different storage backends
 * (file-based, in-memory, database, etc.) without changing application logic.
 */
export class StorageInterface {
  /**
   * Initialize the storage system
   * @returns {Promise<void>}
   */
  async init() {
    throw new Error('init() method must be implemented by storage adapter');
  }

  /**
   * Read all data from storage
   * @returns {Promise<Object>} The complete data structure
   */
  async read() {
    throw new Error('read() method must be implemented by storage adapter');
  }

  /**
   * Write complete data structure to storage
   * @param {Object} data - The data to write
   * @returns {Promise<void>}
   */
  async write(data) {
    throw new Error('write() method must be implemented by storage adapter');
  }

  /**
   * Get all records from a collection
   * @param {string} collection - Collection name
   * @returns {Promise<Array>} Array of records
   */
  async getCollection(collection) {
    throw new Error('getCollection() method must be implemented by storage adapter');
  }

  /**
   * Get a single record by ID from a collection
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<Object|null>} Record or null if not found
   */
  async getRecord(collection, id) {
    throw new Error('getRecord() method must be implemented by storage adapter');
  }

  /**
   * Create a new record in a collection
   * @param {string} collection - Collection name
   * @param {Object} record - Record data (without ID)
   * @returns {Promise<Object>} Created record with generated ID
   */
  async createRecord(collection, record) {
    throw new Error('createRecord() method must be implemented by storage adapter');
  }

  /**
   * Update an existing record in a collection
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated record or null if not found
   */
  async updateRecord(collection, id, updates) {
    throw new Error('updateRecord() method must be implemented by storage adapter');
  }

  /**
   * Delete a record from a collection
   * @param {string} collection - Collection name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteRecord(collection, id) {
    throw new Error('deleteRecord() method must be implemented by storage adapter');
  }

  /**
   * Get storage statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    throw new Error('getStats() method must be implemented by storage adapter');
  }

  /**
   * Create a backup of the current data
   * @returns {Promise<Object>} Backup data with metadata
   */
  async createBackup() {
    throw new Error('createBackup() method must be implemented by storage adapter');
  }

  /**
   * Clear all data from storage
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error('clear() method must be implemented by storage adapter');
  }

  /**
   * Check if storage is healthy/accessible
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    throw new Error('healthCheck() method must be implemented by storage adapter');
  }
}

/**
 * Storage adapter types enum
 */
export const StorageTypes = {
  FILE: 'file',
  MEMORY: 'memory',
  DATABASE: 'database' // For future database implementations
};

/**
 * Default collections structure
 */
export const DefaultCollections = {
  users: [],
  posts: [],
  comments: []
};