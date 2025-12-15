import express from "express";
import routes from "./routes/index.js";
import { storageManager, StorageFactory } from "./utils/storageFactory.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Async middleware for JSON parsing with error handling
app.use(express.json({
  limit: '10mb',
  type: 'application/json'
}));

app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Routes with async support
app.use(routes);

// Async error handling middleware
app.use(async (err, req, res, next) => {
  console.error('Async Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Handle different types of errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body',
      details: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Async 404 handler
app.use(async (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'GET /api/storage/health',
      'GET /api/storage/stats',
      'GET /api/storage/backup',
      'DELETE /api/storage/clear',
      'GET /api/storage/{collection}',
      'POST /api/storage/{collection}',
      'GET /api/storage/{collection}/{id}',
      'PUT /api/storage/{collection}/{id}',
      'DELETE /api/storage/{collection}/{id}'
    ]
  });
});

// Async server startup with storage initialization
const startServer = async () => {
  try {
    // Initialize storage with environment-based selection
    console.log('🔄 Initializing storage...');
    const storageConfig = StorageFactory.getConfig();
    console.log('📋 Storage configuration:', {
      type: storageConfig.detectedType,
      environment: storageConfig.nodeEnv
    });
    
    await storageManager.init();
    console.log('✅ Storage initialized successfully');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💾 Storage API: http://localhost:${PORT}/api/storage`);
      console.log(`📈 Stats: http://localhost:${PORT}/api/storage/stats`);
      console.log(`🔄 Storage type: ${storageConfig.detectedType.toUpperCase()}`);
      console.log('✅ Server ready with storage adapter pattern');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Try setting STORAGE_TYPE=memory for fallback');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
