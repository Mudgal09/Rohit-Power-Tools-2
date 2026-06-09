import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();



// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
    const { amount, currency = 'INR', orderData } = req.body;
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: `order_${Date.now()}`
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in DB (unpaid)
    const order = await Order.create({
      user: req.user._id,
      ...orderData,
      paymentResult: { razorpay_order_id: razorpayOrder.id, status: 'created' }
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      isPaid: true,
      paidAt: Date.now(),
      status: 'Processing',
      paymentResult: { razorpay_order_id, razorpay_payment_id, razorpay_signature, status: 'paid' }
    }, { new: true });

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
