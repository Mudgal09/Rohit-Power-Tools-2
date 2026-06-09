import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are Bolt AI, the intelligent assistant for Rohit Power Tools — India's #1 Power Tool Store based in Bahadurgarh, Haryana.

You help customers with:
- Recommending the right power tools (Drills, Grinders, Saws, Wrenches, Sanders, Accessories)
- Brands we carry: Bosch, DeWalt, Makita, Stanley, Hitachi, Milwaukee
- Pricing, warranty (2-year on premium tools), and availability
- Shipping info (free above ₹2000, same-day dispatch before 2PM)
- Returns policy (30-day hassle-free)
- Technical questions about tools
- Safety tips for using power tools

Always be helpful, professional, and concise. If asked about something outside your scope, politely redirect to our store topics.`;

router.post('/message', protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY is not set in .env' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build valid history — Gemini requires strict alternating user/model turns
    // Filter out any invalid or consecutive same-role entries
    const validHistory = [];
    let lastRole = null;
    for (const h of history) {
      const role = h.role === 'model' ? 'model' : 'user';
      if (role !== lastRole) {
        validHistory.push({ role, parts: [{ text: h.content || '' }] });
        lastRole = role;
      }
    }

    // Always start history with user turn (system prompt as first user message)
    const chatHistory = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: "I'm Bolt AI ⚡ — ready to help you find the perfect power tools! How can I assist you today?" }] },
      ...validHistory
    ];

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ success: true, message: response });
  } catch (err) {
    // Log the real error in backend terminal
    console.error('Gemini API Error:', err.message || err);
    res.status(500).json({
      success: false,
      message: `AI Error: ${err.message || 'Unknown error'}. Check backend terminal for details.`
    });
  }
});

// Public chat (no auth)
router.post('/public', async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY not set' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nCustomer says: ${message}`);
    res.json({ success: true, message: result.response.text() });
  } catch (err) {
    console.error('Gemini Public Error:', err.message || err);
    res.status(500).json({ success: false, message: err.message || 'AI unavailable' });
  }
});

export default router;
