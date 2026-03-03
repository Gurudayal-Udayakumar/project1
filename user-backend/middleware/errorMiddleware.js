export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  if (statusCode >= 500) {
    console.error("[ERROR]", {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && isProd ? "Internal server error" : err.message,
    ...(isProd ? {} : { details: err.details || null }),
  });
};
