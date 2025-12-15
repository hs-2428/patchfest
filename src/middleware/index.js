// Logging middleware
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

// TODO: Add more middleware here
// Example:
// export const authenticate = (req, res, next) => { ... };
// export const validateInput = (req, res, next) => { ... };