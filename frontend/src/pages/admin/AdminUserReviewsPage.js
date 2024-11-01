import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar'; 
import ReviewList from '../../components/ReviewList'; 

const AdminUserReviewsPage = () => {
  const { userId } = useParams(); // Get user ID from the URL
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/user/${userId}`); // Fetch reviews for the user
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user reviews');
        }

        setReviews(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserReviews();
  }, [userId]);

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
        {error && <p className="text-red-500">{error}</p>}
        {reviews.length > 0 ? (
          <ReviewList reviews={reviews} />
        ) : (
          <p className="text-gray-500">This user has no reviews.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserReviewsPage;
