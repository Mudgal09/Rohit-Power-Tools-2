import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Drills', 'Grinders', 'Saws', 'Wrenches', 'Sanders', 'Accessories']
  },
  brand: {
    type: String,
    required: true,
    enum: ['Bosch', 'DeWalt', 'Makita', 'Stanley', 'Hitachi', 'Milwaukee', 'Other']
  },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  features: [String],
  warranty: { type: String, default: '2 Years' },
  isFeatured: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

// Update rating on review change
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

export default mongoose.model('Product', productSchema);
