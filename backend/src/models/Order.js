const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: Number },
  product_id: { type: Number, default: null },
  product_name: { type: String, default: '' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String, default: '' },
  color: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  note: { type: String, default: '' },
  total_amount: { type: Number, required: true },
  shipping_fee: { type: Number, default: 0 },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  distance_km: { type: Number, default: null },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  cancel_reason: { type: String, default: null },
  refund_status: { type: String, default: 'none' },
  items: [orderItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
