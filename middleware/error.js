const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (error, req, res, next) => {
  // Log error for development
  console.log(error);

  let err = {
    ...error
  };

  err.message = error.message;

  // Mongoose bad ObjectID
  if (err.name === 'CastError') {
    const message = `Resourse not found.`;
    err = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate field value
  if (err.code === 11000) {
    const message = 'You have entered duplicate field value.';
    err = new ErrorResponse(message, 400);
  }

  // Mongoose required field error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message);
    err = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
};

module.exports = errorHandler;
