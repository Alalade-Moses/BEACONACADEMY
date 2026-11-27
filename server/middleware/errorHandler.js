export const errorHandler = (err, req, res, next) => {
  // Log complete diagnostics server-side only
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON request payload.'
    });
  }

  // Payload too large
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Request payload is too large.'
    });
  }

  // PostgreSQL error codes — never expose raw SQL/table/constraint internals to clients
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid identifier or input format provided.'
    });
  }
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with these unique details already exists.'
    });
  }
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist.'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  // For 5xx errors in production, never leak internal details or stack traces
  const safeMessage = isClientError
    ? (err.message || 'Invalid request.')
    : (process.env.NODE_ENV === 'development'
        ? (err.message || 'Internal server error occurred.')
        : 'An unexpected server error occurred. Please try again shortly.');

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
