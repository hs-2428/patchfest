// Health Controller
export const getHealth = (req, res) => {
  res.status(200).json({ 
    ok: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
};

// TODO: Add more controller functions here
// Example:
// export const getAllUsers = (req, res) => { ... };
// export const createUser = (req, res) => { ... };