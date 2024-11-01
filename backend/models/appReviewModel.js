const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // Reference the User model
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5  
    },
    // Add new fields for the satisfaction aspects
    uiSatisfaction: {  // User Interface satisfaction
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    outfitSatisfaction: {  // Outfit Recommendations satisfaction
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    aiSatisfaction: {  // AI Outfit Style Recommendation satisfaction
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    uxSatisfaction: {  // User Experience satisfaction
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
}, { timestamps: true });

module.exports = mongoose.model('AppReview', appReviewSchema);
