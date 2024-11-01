const Contact = require('../models/contactModel');

// READ Contact Info
exports.getContactInfo = async (req, res) => {
  try {
    const contactInfo = await Contact.findOne(); 
    if (!contactInfo) {
      return res.status(404).json({ message: 'Contact information not found' });
    }
    
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact information:', error); 
    res.status(500).json({ error: 'Failed to fetch contact information' });
  }
};
