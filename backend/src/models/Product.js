const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  id: { type: Number },
  image_url: { type: String, required: true },
  is_primary: { type: Boolean, default: false }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  category_id: { type: Number, default: null },
  price: { type: Number, required: true },
  original_price: { type: Number, default: null },
  description: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  images: [productImageSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
