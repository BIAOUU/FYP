import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductList from '../../components/ProductList';
import NavBar from '../../components/NavBar';  
import ReviewList from '../../components/ReviewList'; 
import { useAuthContext } from '../../hooks/useAuthContext';

const UserListingsPage = () => {
    const { userId } = useParams();  // Get the userId from the route
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);  // New state for reviews
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');  
    const [showReviewForm, setShowReviewForm] = useState(false); // Control review form visibility
    const [newReview, setNewReview] = useState({ rating: '', comment: '' }); // Form state

    const { user } = useAuthContext(); // Get logged-in user info
    const navigate = useNavigate(); // For redirecting

    useEffect(() => {
        // Fetch products for this user
        const fetchUserProducts = async () => {
            try {
                const response = await fetch(`/api/products/user/${userId}`);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user products.');
                }

                setProducts(data.products);
                setUserName(data.userName);  // Set the user's name from the response
            } catch (err) {
                setError(err.message);
            }
        };

        // Fetch reviews about this user (reviews received)
        const fetchUserReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/user/${userId}`);  // Reviews about this user
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user reviews.');
                }

                setReviews(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserProducts();
        fetchUserReviews();
    }, [userId]);

    const handleWriteReview = () => {
        if (!user) {
            navigate('/login'); // Redirect to marketplace if not logged in
            return;
        }
        setShowReviewForm(true); // Show the review form if logged in
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`, // Use token for authentication
                },
                body: JSON.stringify({
                    reviewer: user._id,
                    reviewedUser: userId,
                    rating: newReview.rating,
                    comment: newReview.comment,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review.');
            }

            setReviews(prevReviews => [...prevReviews, data]); // Add new review to the list
            setShowReviewForm(false); // Hide form after successful submission
            setNewReview({ rating: '', comment: '' }); // Reset form fields
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <NavBar />  {/* Add NavBar at the top */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">{userName ? `${userName}'s Listings` : "User's Listings"}</h2>  {/* Display user's name */}
                {error && <p className="text-red-500">{error}</p>}
                <ProductList products={products} />
                
                <hr className="my-10 border-t-2 border-gray-300" />

                {/* Reviews Section */}
                <h2 className="text-2xl font-bold mt-12 mb-6">{userName ? `${userName}'s Reviews` : "User's Reviews"}</h2>
                {reviews.length > 0 ? (
                    <ReviewList reviews={reviews} />
                ) : (
                    <p>No reviews available for this user.</p>
                )}

                {/* Write Review Button */}
                <button
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={handleWriteReview}
                >
                    Write a Review
                </button>

                {/* Review Form (shown when button is clicked) */}
                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Rating (1-5):
                        </label>
                        <input
                            type="number"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            min="1"
                            max="5"
                            required
                            className="mt-1 p-2 border rounded w-full"
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Comment:
                        </label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            required
                            className="mt-1 p-2 border rounded w-full"
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                            Submit Review
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserListingsPage;
