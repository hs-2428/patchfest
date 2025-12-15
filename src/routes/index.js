import express from 'express';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Server is running' });
});

// TODO: Add more routes here
// Example:
// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

export default router;