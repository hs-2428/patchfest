import express from "express";
import routes from "./routes/index.js";

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
      'GET /api/storage/stats',
      'GET /api/storage/{collection}',
      'POST /api/storage/{collection}',
      'PUT /api/storage/{collection}/{id}',
      'DELETE /api/storage/{collection}/{id}'
    ]
  });
});

// Async server startup
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Async Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`💾 Storage API: http://localhost:${PORT}/api/storage`);
      console.log(`📈 Stats: http://localhost:${PORT}/api/storage/stats`);
      console.log('✅ All operations using async/await with fs.promises');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
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
