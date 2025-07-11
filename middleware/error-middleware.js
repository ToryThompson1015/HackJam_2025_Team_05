export const setupErrorHandling = (app) => {
  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    // Validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(err.errors).map(error => ({
          field: error.path,
          message: error.message
        }))
      });
    }

    // Duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    // Generic error
    res.status(err.status || 500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!' 
        : err.message
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ 
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    });
  });
};