const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const User = require('../models/userModel');
const vision = require('@google-cloud/vision'); // Google Cloud Vision API

const fs = require('fs');

// Create Vision API client
const visionClient = new vision.ImageAnnotatorClient();

exports.createProduct = async (req, res) => {
  try {
    let imageUrl = '';
    let description = req.body.description || ''; // Default description

    if (req.file) {
      // Step 1: Analyze the image using Google Vision API
      const [result] = await visionClient.labelDetection(req.file.path);
      const labels = result.labelAnnotations.map(label => label.description);

      // Generate a description based on the detected labels
      description = `This product is associated with: ${labels.join(', ')}.`;

      // Step 2: Upload the image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;

      // Step 3: Delete the image file from the local server after upload
      fs.unlinkSync(req.file.path);
    }

    // Step 4: Save the product in the database
    const product = new Product({
      ...req.body,
      description: description, // Use auto-generated description
      imageUrl,
      createdBy: req.user._id // Associate with logged-in user
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// READ ALL PRODUCTS WITH PAGINATION
exports.getProducts = async (req, res) => {
  try {
    const { search, sort, categoryPreferences, page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const query = {};

    // Apply search filter if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // If categoryPreferences is provided, filter products by category
    if (categoryPreferences) {
      query.category = { $in: categoryPreferences.split(',') }; // Assume it's a comma-separated string
    }

    // Apply sorting
    let sortOptions = {};
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'category') {
      sortOptions = { category: 1 };
    }

    // Pagination logic
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments(query); // Count total number of products for this query

    const products = await Product.find(query)
      .populate('category')
      .populate('createdBy')
      .sort(sortOptions)
      .skip(skip)  // Skip items for pagination
      .limit(parseInt(limit));  // Limit the number of items

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// READ ONE
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'createdBy',
        select: 'profile.name' // Populate only the profile.name field from the createdBy document
      })
      .populate('category'); // Ensure category is populated if needed

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ PRODUCTS BY USER
exports.getProductsByUser = async (req, res) => {
  try {
    const userId = req.user._id;  // req.user is set by requireAuth middleware
    console.log("Fetching products for user:", userId);  // Debugging user ID

    // Fetch products created by this user
    const products = await Product.find({ createdBy: userId })
      .populate('category')
      .populate('createdBy', 'name');  // Populate 'createdBy', but only include the name field

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this user.' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching user's products:", error);  // Log any errors
    res.status(400).json({ error: error.message });
  }
};

// READ PRODUCTS BY ANY USER (based on userId param)
exports.getProductsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the products created by this user
    const products = await Product.find({ createdBy: userId })
      .populate('category')
      .populate('createdBy', 'profile.name');

    if (!products.length) {
      const user = await User.findById(userId).select('profile.name');
      return res.status(200).json({ products: [], userName: user ? user.profile.name : 'Unknown User' });
    }

    // Find the user to get the name
    const user = await User.findById(userId).select('profile.name');

    res.status(200).json({ products, userName: user.profile.name });
  } catch (error) {
    console.error("Error fetching user's products:", error);
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Product (only owner can update)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the user updating the product is either the owner or an admin
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    let imageUrl = product.imageUrl;
    if (req.file) {
      if (product.imageUrl) {
        const public_id = product.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Delete the file after uploading
    }

    product = await Product.findByIdAndUpdate(req.params.id, { ...req.body, imageUrl }, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// DELETE Product (only owner can delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the user deleting the product is the owner
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Handle cloudinary image deletion if necessary
    if (product.imageUrl) {
      const public_id = product.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(public_id);
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ PRODUCTS WITH PRICE <= 30
exports.getGreatDeals = async (req, res) => {
  try {
    const greatDeals = await Product.find({ price: { $lte: 30 } })
      .populate('category')
      .populate('createdBy', 'profile.name')
      .sort({ price: 1 }); // Sort by price in ascending order (cheapest first)

    res.status(200).json(greatDeals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ RECOMMENDED PRODUCTS BASED ON CATEGORY PREFERENCES (no pagination)
exports.getRecommendedProducts = async (req, res) => {
  try {
    const { categoryPreferences } = req.query;
    const query = {};

    // If categoryPreferences is provided, filter products by category
    if (categoryPreferences) {
      query.category = { $in: categoryPreferences.split(',') }; // Assume it's a comma-separated string
    }

    // Fetch products matching the category preferences
    const products = await Product.find(query)
      .populate('category')
      .populate('createdBy');

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getComplementaryProducts = async (req, res) => {
  const { category } = req.query; // The predicted category ('Top', 'Bottom', 'Shoes')

  try {
    let complementaryCategories;

    // Based on the predicted category, find complementary items (excluding the predicted category)
    if (category === 'Top') {
      complementaryCategories = ['Bottom', 'Shoes']; // If Top, get Bottom and Shoes
    } else if (category === 'Bottom') {
      complementaryCategories = ['Top', 'Shoes']; // If Bottom, get Top and Shoes
    } else if (category === 'Shoes') {
      complementaryCategories = ['Top', 'Bottom']; // If Shoes, get Top and Bottom
    } else {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Use a $lookup to join Product collection with the Category collection
    const results = await Promise.all(
      complementaryCategories.map(async (cat) => {
        const items = await Product.aggregate([
          {
            $lookup: {
              from: 'categories', // Name of the 'categories' collection in your database
              localField: 'category', // The field from Product that references Category
              foreignField: '_id', // The field from Category that matches the Product category field
              as: 'categoryDetails' // Alias for the joined data
            }
          },
          {
            $unwind: '$categoryDetails' // Unwind the array of categoryDetails
          },
          {
            $match: {
              'categoryDetails.name': cat // Match products in the complementary categories
            }
          },
          { $sample: { size: 1 } }
        ]);

        return items[0]; // Return the first item in the array
      })
    );

    // Filter out any undefined results (in case no items exist for a category)
    const complementaryItems = results.filter(item => item !== undefined);

    // Log the results to see if products are being fetched
    console.log("Complementary products found:", complementaryItems);

    res.status(200).json(complementaryItems);
  } catch (error) {
    console.error("Error fetching complementary items:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.generateDescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Step 1: Analyze the image using Google Vision API
    const [result] = await visionClient.labelDetection(req.file.path);
    const labels = result.labelAnnotations.map(label => label.description);

    // Step 2: Generate a description based on the detected labels
    const description = `This outfit is associated with: ${labels.join(', ')}.`;

    // Return the generated description
    res.status(200).json({ description });

    // Clean up the local image file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Error generating description:', error.message);
    res.status(500).json({ error: 'Failed to generate description' });
  }
};

exports.generateRecommendations = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Step 1: Analyze the image using Google Vision API
    const [result] = await visionClient.labelDetection(req.file.path);
    const labels = result.labelAnnotations.map((label) => label.description);

    // Step 2: Create a description based on detected labels
    const description = `This product is associated with: ${labels.join(', ')}.`;

    // Clean up the image file after processing
    fs.unlinkSync(req.file.path);

    // Step 3: Perform content-based filtering to find similar products
    const products = await Product.find({
      description: { $regex: labels.join('|'), $options: 'i' }, // Match products with similar labels
    });

    res.status(200).json({ description, recommendations: products });
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

exports.unlistProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the user unlisting the product is either the owner or an admin
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to unlist this product' });
    }

    // Unlist the product
    product.listed = false;
    await product.save();

    res.status(200).json({ message: 'Product unlisted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.listProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the user listing the product is either the owner or an admin
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to list this product' });
    }

    // List the product
    product.listed = true;
    await product.save();

    res.status(200).json({ message: 'Product listed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
