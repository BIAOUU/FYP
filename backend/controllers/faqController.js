const { FAQ, Inquiry } = require('../models/FAQModel');

// CREATE FAQ
exports.createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().populate('inquiries');
    res.status(200).json(faqs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ONE FAQ
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id).populate('inquiries');
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    await faq.deleteOne();
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// CREATE Inquiry
exports.createInquiry = async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();

    const faq = await FAQ.findById(req.body.faqId);
    faq.inquiries.push(inquiry._id);
    await faq.save();

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    const faq = await FAQ.findOne({ inquiries: inquiry._id });
    faq.inquiries.pull(inquiry._id);
    await faq.save();

    await inquiry.deleteOne();
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST FAQ answer
exports.answerFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    faq.answer = req.body.answer;
    await faq.save();

    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};