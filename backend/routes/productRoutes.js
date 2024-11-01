const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByUser,
  getProductsByUserId,
  getGreatDeals,
  getRecommendedProducts,
  getComplementaryProducts,
  generateDescription,
  generateRecommendations,
  unlistProduct,

} = require('../controllers/productController');
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.get('/great-deals', getGreatDeals);
router.get('/my-products', requireAuth, getProductsByUser);
router.get('/recommended-products', getRecommendedProducts);
router.get('/complementary', getComplementaryProducts);
router.post('/generate-recommendations',upload.single('image'),generateRecommendations);


router.post('/generate-description', requireAuth, upload.single('image'), generateDescription);
router.post('/', requireAuth, upload.single('image'), createProduct);
router.get('/', getProducts);
// Dynamic route comes last
router.get('/:id', getProductById);
// Fetch products created by a specific user
router.get('/user/:userId', getProductsByUserId);  // No auth needed to view another user's listings
router.put('/:id', requireAuth, upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, deleteProduct);
// Route for unlisting product
router.put('/:id/unlist', requireAuth, unlistProduct);


module.exports = router;
