import React, { useState, useEffect } from 'react';
import AdminNavBar from '../../components/AdminNavBar';
import { FaStar, FaRegStar } from 'react-icons/fa'; // FontAwesome icons

const AdminViewSurveyPage = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch('/api/app-reviews');  // Fetching all reviews
                if (!response.ok) {
                    throw new Error('Failed to fetch surveys');
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSurveys();
    }, []);

    // Render star ratings
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-yellow-500" />); // Filled star
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />); // Empty star
            }
        }
        return stars;
    };

    return (
        <div>
            <AdminNavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">View Surveys</h2>
                {error && <p className="text-red-500">{error}</p>}
                {reviews.length > 0 ? (
                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li key={review._id} className="p-4 bg-gray-100 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold">{review.user?.profile?.name || 'Anonymous'}</h3>
                                
                                {/* Display star rating */}
                                <div className="flex items-center">
                                    <span className="mr-2">Rating:</span>
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-gray-600">({review.rating}/5)</span>
                                </div>
                                
                                {/* UI Satisfaction stars */}
                                <div className="flex items-center mt-2">
                                    <span className="mr-2">UI Satisfaction:</span>
                                    {renderStars(review.uiSatisfaction)}
                                    <span className="ml-2 text-gray-600">({review.uiSatisfaction}/5)</span>
                                </div>

                                {/* Outfit Satisfaction stars */}
                                <div className="flex items-center mt-2">
                                    <span className="mr-2">Outfit Satisfaction:</span>
                                    {renderStars(review.outfitSatisfaction)}
                                    <span className="ml-2 text-gray-600">({review.outfitSatisfaction}/5)</span>
                                </div>

                                {/* AI Satisfaction stars */}
                                <div className="flex items-center mt-2">
                                    <span className="mr-2">AI Satisfaction:</span>
                                    {renderStars(review.aiSatisfaction)}
                                    <span className="ml-2 text-gray-600">({review.aiSatisfaction}/5)</span>
                                </div>

                                {/* UX Satisfaction stars */}
                                <div className="flex items-center mt-2">
                                    <span className="mr-2">UX Satisfaction:</span>
                                    {renderStars(review.uxSatisfaction)}
                                    <span className="ml-2 text-gray-600">({review.uxSatisfaction}/5)</span>
                                </div>

                                <p className="text-gray-600 mt-4">Feedback: {review.feedback}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No surveys available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminViewSurveyPage;
