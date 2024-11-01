import React from 'react';

// StarRating Component
const StarRating = ({ rating }) => {
    const stars = [];

    // Create an array of 5 stars and fill them based on the rating
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                ★
            </span>
        );
    }

    return <div>{stars}</div>; // Render stars
};

// Individual Review Component
const ReviewCard = ({ review }) => {
    const reviewerName = review.reviewer?.profile?.name || 'Anonymous'; // Ensure safe access to name

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6"> {/* Add mb-6 to create more spacing */}
            <h3 className="text-lg font-semibold">{reviewerName}</h3>
            {/* Star Rating instead of numeric */}
            <StarRating rating={review.rating} />
            <p className="text-gray-600 mt-2">{review.comment}</p>
        </div>
    );
};

// Review List Component
const ReviewList = ({ reviews }) => {
    return (
        <div className="mt-10"> {/* Add margin-top to create space between listings and reviews */}
            {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
            ))}
        </div>
    );
};

export default ReviewList;
