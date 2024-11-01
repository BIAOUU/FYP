const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel')
const requireAuth = require('../middleware/requireAuth'); // Adjust the path based on your project structure

// Add to favorites
router.post('/favorite/:id', requireAuth, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove from favorites
router.delete('/favorite/:id', requireAuth, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const user = await User.findById(userId);
        user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Check if product is in favorites
router.get('/favorite/:id', requireAuth, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;

    try {
        const user = await User.findById(userId);
        const isFavorite = user.favorites.includes(productId);
        res.status(200).json({ isFavorite });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all favorite products of the logged-in user
router.get('/favorites', requireAuth, async (req, res) => {
    const userId = req.user._id;

    try {
        // Find the user and populate the `favorites` array with product details
        const user = await User.findById(userId).populate({
            path: 'favorites',
            model: Product, // Populate the products
            populate: { path: 'category' }, // Optionally, populate the product's category as well
        });

        // If no favorites found, return an empty array
        if (!user.favorites || user.favorites.length === 0) {
            return res.status(200).json([]); // Return an empty array with 200 status
        }

        res.status(200).json(user.favorites); // Return the favorite products
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
