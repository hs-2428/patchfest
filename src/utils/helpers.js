// Utility functions

// Generate unique ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// TODO: Add more utility functions here
// Example:
// export const formatDate = (date) => { ... };
// export const sanitizeInput = (input) => { ... };