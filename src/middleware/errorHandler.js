const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    err.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = `Duplicate value for field: ${Object.keys(err.keyValue).join(', ')}`;
    err.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message,
  });
};

module.exports = { errorHandler };   