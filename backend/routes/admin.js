import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find()
    ]);
    const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
    const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(10);
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
      recentOrders,
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All users
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ success: true, users });
});

// Update user role
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ success: true, user });
});

// Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

export default router;
