/**
 * Security Middleware - Industry-appropriate security features
 * Includes: Input sanitization, SQL injection prevention, rate limiting, and XSS protection
 */

// Rate limiting storage (in production, use Redis)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP address
 */
exports.rateLimiter = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Get or create request tracking for this IP
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { count: 0, resetTime: now + RATE_LIMIT_WINDOW });
  }

  const clientData = requestCounts.get(clientIp);

  // Reset counter if window has passed
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  // Check if limit exceeded
  if (clientData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  // Increment counter
  clientData.count++;
  
  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - clientData.count);
  res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

  next();
};

/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */
exports.sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * SQL Injection Prevention
 * Validates that input doesn't contain SQL injection patterns
 */
exports.preventSqlInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(;|--|\/\*|\*\/|xp_|sp_)/gi,
    /('|")\s*(OR|AND)\s*('|")\s*=\s*('|")/gi
  ];

  const checkForSqlInjection = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        for (let pattern of sqlPatterns) {
          if (pattern.test(obj[key])) {
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkForSqlInjection(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (
    checkForSqlInjection(req.body || {}) ||
    checkForSqlInjection(req.query || {}) ||
    checkForSqlInjection(req.params || {})
  ) {
    return res.status(400).json({
      error: 'Invalid input detected. Please check your data and try again.'
    });
  }

  next();
};

/**
 * Content Security Policy Headers
 * Helps prevent XSS and data injection attacks
 */
exports.securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HTTPS only)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  next();
};

/**
 * Request Validation Middleware
 * Validates request size and content type
 */
exports.validateRequest = (req, res, next) => {
  // Check content length (max 1MB)
  const maxSize = 1024 * 1024; // 1MB
  const contentLength = req.headers['content-length'];
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      error: 'Request payload too large. Maximum size is 1MB.'
    });
  }

  // Validate content type for POST/PUT requests
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported media type. Content-Type must be application/json.'
      });
    }
  }

  next();
};

/**
 * Error Handler Middleware
 * Catches and sanitizes error messages to prevent information disclosure
 */
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const statusCode = err.statusCode || 500;
  const message = isDevelopment 
    ? err.message 
    : 'An error occurred while processing your request.';

  res.status(statusCode).json({
    error: message,
    ...(isDevelopment && { stack: err.stack })
  });
};

/**
 * Helper function to sanitize objects recursively
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }

  const sanitized = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = typeof obj[key] === 'object' 
        ? sanitizeObject(obj[key])
        : sanitizeString(obj[key]);
    }
  }

  return sanitized;
}

/**
 * Helper function to sanitize strings
 * Removes potentially dangerous characters
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  return str
    .replace(/[<>]/g, '') // Remove angle brackets (XSS prevention)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Audit Logger Middleware
 * Logs all database modification operations for security auditing
 */
exports.auditLogger = (req, res, next) => {
  // Log only modification operations
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      body: sanitizeForLog(req.body)
    };

    console.log('[AUDIT]', JSON.stringify(logEntry));
  }

  next();
};

/**
 * Helper to sanitize sensitive data before logging
 */
function sanitizeForLog(data) {
  if (!data) return data;
  
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}

module.exports = exports;