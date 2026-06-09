import express from 'express';
import { upload } from '../middleware/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, public_id: req.file.filename });
});

// Upload multiple images
router.post('/images', protect, adminOnly, upload.array('images', 5), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded' });
  const urls = req.files.map(f => ({ url: f.path, public_id: f.filename }));
  res.json({ success: true, urls });
});

export default router;
