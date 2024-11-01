const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productReportSchema = new Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  reason: { type: String, required: true }, 
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, { timestamps: true }); 

module.exports = mongoose.model('ProductReport', productReportSchema);
