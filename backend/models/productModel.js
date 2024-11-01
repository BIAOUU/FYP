const mongoose = require('mongoose');

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  sizes: [String],
  discount: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listed: { type: Boolean, default: true },  
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReport' }]
}, {timestamps: true});


module.exports = mongoose.model('Product', productSchema);
