import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../../components/ProductList';

const UserDetailPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [recentReview, setRecentReview] = useState(null);  // Save the latest review
    const [reportHistory, setReportHistory] = useState([]);  // Modified report history
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);  // Used to handle button click state

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token;

                // Fetch user details
                const userResponse = await fetch(`/api/user/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!userResponse.ok) throw new Error('Failed to fetch user');
                const userData = await userResponse.json();
                setUser(userData);

                // Fetch products created by the user
                const productResponse = await fetch(`/api/products/user/${userId}`);
                const productData = await productResponse.json();
                if (!productResponse.ok) throw new Error(productData.error || 'Failed to fetch products');
                setProducts(productData.products);
                setUserName(productData.username);

                // Fetch reviews for the user
                const reviewResponse = await fetch(`/api/reviews/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!reviewResponse.ok) throw new Error('Failed to fetch reviews');
                const reviewData = await reviewResponse.json();
                setReviews(reviewData);

                // Set the latest review as the first entry
                if (reviewData.length > 0) {
                    setRecentReview(reviewData[0]);  // Latest review
                }

                // Fetch report history for the user's products
                const reportResponse = await fetch(`/api/reports/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!reportResponse.ok) throw new Error('Failed to fetch report history');
                const reportData = await reportResponse.json();
                setReportHistory(reportData);  // Only fetch reports for this user
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserDetails();
    }, [userId]);

    // Handle Suspend button click event
    const handleSuspend = async () => {
        setIsSubmitting(true);  // Set submitting state
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;

            const response = await fetch(`/api/user/suspend/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Ensure Authorization header is set correctly
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update suspend status');
            }

            // Update user's suspended status
            const updatedUser = { ...user, suspended: !user.suspended };
            setUser(updatedUser);  // Update the user's state on the frontend
        } catch (err) {
            setError('Failed to update suspend status');
        } finally {
            setIsSubmitting(false);  // Reset submitting state
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!user) return <p>Loading...</p>;

    // Calculate average rating from the reviews
    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;

    // Render star ratings based on the average rating
    const renderStars = (rating) => {
        const totalStars = 5;
        return (
            <div className="rating">
                {[...Array(totalStars)].map((_, index) => (
                    <span key={index}>
                        {index < rating ? (
                            <i className="fas fa-star text-yellow-500"></i>
                        ) : (
                            <i className="far fa-star text-gray-300"></i>
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">View User Detail</h1>

            {/* User info and suspend button */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <img
                        src={`https://avatars.dicebear.com/api/initials/${user.email}.svg`}
                        alt={user.email}
                        className="w-24 h-24 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-medium">{user.profile?.name || 'No Name'}</h2>
                        {/* Star rating and review count */}
                        <div className="flex items-center">
                            {renderStars(averageRating)}
                            <span className="ml-2 text-gray-600">{reviews.length} Reviews</span>
                        </div>
                        <p>{user.transactions || 0} Transactions | {products.length} Products on Sale</p>
                    </div>
                </div>
                <button
                    className={`${user.suspended ? 'bg-green-600' : 'bg-red-600'
                        } text-white px-4 py-2 rounded-md`}
                    onClick={handleSuspend}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : user.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
            </div>

            {/* Recent Review and Report History */}
            <div className="flex justify-between mb-8">
                {/* Recent Review */}
                <div className="flex-1 mr-8">
                    <h3 className="text-xl font-bold">Recent Review</h3>
                    {recentReview ? (
                        <div className="flex items-center">
                            <img src={`https://avatars.dicebear.com/api/initials/${recentReview.reviewer?.name || recentReview.reviewer?.email}.svg`} alt={recentReview.reviewer?.name || recentReview.reviewer?.email} className="w-10 h-10 rounded-full mr-2" />
                            <div>
                                <p className="font-medium">{recentReview.reviewer?.name || recentReview.reviewer?.email}</p>
                                {renderStars(recentReview.rating)}
                                <p>{recentReview.comment}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent reviews</p>  
                    )}
                    {recentReview && (
                        <a href={`/admin/reviews/user/${userId}`} className="text-blue-600">View More</a>
                    )}
                </div>

                {/* Report History */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold">Report History</h3>
                    {reportHistory.length > 0 ? (
                        <div className="flex items-center">
                            <img src={`https://avatars.dicebear.com/api/initials/${reportHistory[0].reporter?.name || reportHistory[0].reporter?.email}.svg`} alt={reportHistory[0].reporter?.name || reportHistory[0].reporter?.email} className="w-10 h-10 rounded-full mr-2" />
                            <div>
                                <p className="font-medium">{reportHistory[0].reporter?.name || reportHistory[0].reporter?.email}</p>
                                <p>{reportHistory[0].reason}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No reports</p> 
                    )}
                    {reportHistory.length > 0 && (
                        <a href={`/admin/reports/user/${userId}`} className="text-blue-600">View More</a>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">{userName ? `${userName}'s Listings` : "User's Listings"}</h2>
            {error && <p className="text-red-500">{error}</p>}
            {products.length > 0 ? (
                <ProductList products={products} />
            ) : (
                <p className="text-gray-500">This user currently has no products available.</p>  // Updated to English
            )}
            <hr className="my-10 border-t-2 border-gray-300" />
        </div>
    );
};

export default UserDetailPage;
