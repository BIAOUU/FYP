import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminListedProductsPage = () => {
  // State variables for products, reviews, and error
  const [products, setProducts] = useState([]);
  // const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  // Effect hook to fetch products and reviews when the component mounts
  useEffect(() => {
    const fetchProductsAndReviews = async () => {
      try {
        // Get user token from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser ? storedUser.token : null;

        // Fetch product data from the server with authentication token
        const productResponse = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Throw error if product fetch fails
        if (!productResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productData = await productResponse.json();
        // Set products in state or fallback to empty array if no products exist
        setProducts(Array.isArray(productData) ? productData : productData.products || []);

        // Fetch review data from the server with authentication token
        // const reviewResponse = await fetch('/api/reviews', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //   },
        // });

        // Throw error if review fetch fails
        // if (!reviewResponse.ok) {
        //   throw new Error('Failed to fetch reviews');
        // }

        // const reviewData = await reviewResponse.json();
        // setReviews(reviewData); // Set reviews in state
      } catch (error) {
        setError(error.message); // Handle and display any error
      }
    };

    fetchProductsAndReviews(); // Invoke the fetching function
  }, []);

  const navigate = useNavigate();

  // Navigate to the product management page when a product is clicked
  const handleManageProduct = (productId) => {
    navigate(`/admin/manage-product/${productId}`);
  };

  // // Helper function to render rating stars based on a given rating
  // const renderRatings = (rating) => {
  //   const stars = 5;
  //   return (
  //     <div className="rating">
  //       {[...Array(stars)].map((_, index) => (
  //         <span key={index}>
  //           {index < rating ? (
  //             <i className="fas fa-star text-yellow-500"></i>
  //           ) : (
  //             <i className="fas fa-star text-gray-300"></i>
  //           )}
  //         </span>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">View Listed Products</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Use Flexbox to divide sections */} 
      <ul className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product._id} className="flex justify-between items-center border-b pb-4">
              
              {/* First column: Product information */}
              <div className="w-1/3 flex items-center space-x-4">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/100'}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p>Size: {product.sizes.join(', ')}</p>
                  <p>Condition: {product.condition || 'New'}</p>
                  <p>{product.description}</p>
                  <p>Category: {product.category.name || 'Unknown'}</p>
                </div>
              </div>

              {/* Second column: Seller information and ratings */}
              <div className="w-1/3">
                <p className="text-gray-500">Seller: {product.createdBy.profile.name}</p>
                {/* Calculate and display average rating */}
                {/* <p>Ratings: {renderRatings(reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0)}</p> */}
              </div>

              {/* Third column: Manage button, price, and status */}
              <div className="w-1/3 text-right">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  onClick={() => handleManageProduct(product._id)}
                >
                  Manage Product
                </button>
                {/* Status and price displayed with appropriate styling */}
                <p
                  className={`text-sm mt-2 ${product.listed ? 'text-green-600' : 'text-red-600'}`}
                  style={{ fontSize: '1rem' }}  // Font size for status
                >
                  Status: {product.listed ? 'Listed' : 'Unlisted'}
                </p>
                <p className="mt-1" style={{ fontSize: '1rem' }}>Price: ${product.price}</p>  {/* Font size for price */}
              </div>
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>
    </div>
  );
};

export default AdminListedProductsPage;
