import { FileStorage } from '../adapters/fileStorage.js';
import { MemoryStorage } from '../adapters/memoryStorage.js';
import { StorageTypes } from '../interfaces/storageInterface.js';

/**
 * Storage Factory - Environment-based storage adapter selection
 * Provides a centralized way to create storage instances based on configuration
 */
export class StorageFactory {
  /**
   * Create storage adapter based on environment configuration
   * @param {Object} options - Configuration options
   * @param {string} options.type - Storage type override
   * @param {string} options.filePath - Custom file path for file storage
   * @returns {StorageInterface} Configured storage adapter
   */
  static async createStorage(options = {}) {
    const storageType = StorageFactory.getStorageType(options.type);
    
    let storage;
    
    switch (storageType) {
      case StorageTypes.MEMORY:
        storage = new MemoryStorage();
        break;
        
      case StorageTypes.FILE:
      default:
        storage = new FileStorage(options.filePath);
        break;
    }
    
    // Initialize storage
    await storage.init();
    
    console.log(`📦 Storage initialized: ${storageType.toUpperCase()}`);
    
    return storage;
  }

  /**
   * Determine storage type based on environment variables and options
   * @param {string} typeOverride - Explicit type override
   * @returns {string} Storage type to use
   */
  static getStorageType(typeOverride = null) {
    // 1. Check explicit override
    if (typeOverride && Object.values(StorageTypes).includes(typeOverride)) {
      return typeOverride;
    }
    
    // 2. Check STORAGE_TYPE environment variable
    const envStorageType = process.env.STORAGE_TYPE;
    if (envStorageType && Object.values(StorageTypes).includes(envStorageType)) {
      return envStorageType;
    }
    
    // 3. Check NODE_ENV for automatic selection
    const nodeEnv = process.env.NODE_ENV;
    
    switch (nodeEnv) {
      case 'test':
      case 'testing':
        return StorageTypes.MEMORY; // Fast, isolated storage for tests
        
      case 'development':
      case 'dev':
        return process.env.DEV_STORAGE || StorageTypes.FILE;
        
      case 'production':
      case 'prod':
        return StorageTypes.FILE; // Persistent storage for production
        
      default:
        return StorageTypes.FILE; // Default to file storage
    }
  }

  /**
   * Get storage configuration info
   * @returns {Object} Configuration details
   */
  static getConfig() {
    const detectedType = StorageFactory.getStorageType();
    
    return {
      detectedType,
      nodeEnv: process.env.NODE_ENV || 'development',
      storageTypeEnv: process.env.STORAGE_TYPE || null,
      devStorageEnv: process.env.DEV_STORAGE || null,
      availableTypes: Object.values(StorageTypes),
      selection: {
        'test|testing': StorageTypes.MEMORY,
        'development|dev': process.env.DEV_STORAGE || StorageTypes.FILE,
        'production|prod': StorageTypes.FILE,
        'default': StorageTypes.FILE
      }
    };
  }

  /**
   * Create storage with automatic failover
   * If primary storage fails, try fallback options
   * @param {Object} options - Configuration options
   * @returns {StorageInterface} Working storage adapter
   */
  static async createStorageWithFailover(options = {}) {
    const primaryType = StorageFactory.getStorageType(options.type);
    const fallbackTypes = [StorageTypes.FILE, StorageTypes.MEMORY];
    
    // Try primary storage type first
    try {
      const storage = await StorageFactory.createStorage({ 
        ...options, 
        type: primaryType 
      });
      
      // Test storage health
      const isHealthy = await storage.healthCheck();
      if (isHealthy) {
        return storage;
      }
      
      console.warn(`⚠️  Primary storage (${primaryType}) failed health check, trying fallbacks...`);
    } catch (error) {
      console.warn(`⚠️  Primary storage (${primaryType}) failed to initialize:`, error.message);
    }
    
    // Try fallback storage types
    for (const fallbackType of fallbackTypes) {
      if (fallbackType === primaryType) continue; // Skip already tried type
      
      try {
        console.log(`🔄 Trying fallback storage: ${fallbackType}`);
        const storage = await StorageFactory.createStorage({ 
          ...options, 
          type: fallbackType 
        });
        
        const isHealthy = await storage.healthCheck();
        if (isHealthy) {
          console.log(`✅ Successfully initialized fallback storage: ${fallbackType}`);
          return storage;
        }
      } catch (error) {
        console.warn(`⚠️  Fallback storage (${fallbackType}) failed:`, error.message);
      }
    }
    
    throw new Error('All storage adapters failed to initialize');
  }

  /**
   * Validate storage type
   * @param {string} type - Storage type to validate
   * @returns {boolean} True if valid
   */
  static isValidStorageType(type) {
    return Object.values(StorageTypes).includes(type);
  }

  /**
   * Get recommended storage type for current environment
   * @returns {Object} Recommendation with reasoning
   */
  static getRecommendation() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    const recommendations = {
      'test': {
        type: StorageTypes.MEMORY,
        reason: 'Fast, isolated storage for testing'
      },
      'testing': {
        type: StorageTypes.MEMORY,
        reason: 'Fast, isolated storage for testing'
      },
      'development': {
        type: StorageTypes.FILE,
        reason: 'Persistent storage for development with data retention'
      },
      'production': {
        type: StorageTypes.FILE,
        reason: 'Reliable persistent storage for production data'
      }
    };
    
    return recommendations[nodeEnv] || {
      type: StorageTypes.FILE,
      reason: 'Default persistent storage'
    };
  }
}

/**
 * Singleton instance for global storage access
 */
export class StorageManager {
  constructor() {
    this.storage = null;
    this.initialized = false;
  }

  /**
   * Initialize global storage instance
   * @param {Object} options - Configuration options
   */
  async init(options = {}) {
    if (this.initialized) {
      return this.storage;
    }

    this.storage = await StorageFactory.createStorageWithFailover(options);
    this.initialized = true;
    
    return this.storage;
  }

  /**
   * Get current storage instance
   * @returns {StorageInterface} Current storage adapter
   */
  getStorage() {
    if (!this.initialized) {
      throw new Error('Storage not initialized. Call StorageManager.init() first.');
    }
    return this.storage;
  }

  /**
   * Reset storage manager (for testing)
   */
  reset() {
    this.storage = null;
    this.initialized = false;
  }
}

// Export singleton instance
export const storageManager = new StorageManager();