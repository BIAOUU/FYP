const ProductReport = require('../models/productReport');
const Product = require('../models/productModel');

// CREATE ProductReport
exports.createReport = async (req, res) => {
  try {
    const { product, reason, reporter } = req.body;
    console.log(product, reason, reporter);

    if (!product || !reason || !reporter) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const report = new ProductReport({ product, reason, reporter });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL ProductReports
exports.getReports = async (req, res) => {
  try {
    const reports = await ProductReport.find().populate('reporter').populate('product');
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ONE ProductReport
exports.getReportById = async (req, res) => {
  try {
    const report = await ProductReport.findById(req.params.id).populate('reporter').populate('product');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE ProductReport
exports.updateReport = async (req, res) => {
  try {
    const report = await ProductReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE ProductReport
exports.deleteReport = async (req, res) => {
  try {
    const report = await ProductReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    await report.deleteOne();
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get reports for a specific user's products
exports.getReportsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all products created by this user
    const products = await Product.find({ createdBy: userId }).select('_id');  // Get all product IDs created by the user
    const productIds = products.map(product => product._id);  // Get an array of product IDs

    // Find all reports related to these product IDs
    const reports = await ProductReport.find({ product: { $in: productIds } })
      .populate('reporter', 'name email')  // Populate reporter information
      .populate('product', 'name');  // Populate product information

    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
