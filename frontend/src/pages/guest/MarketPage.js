import React, { useContext, useEffect, useState } from 'react';
import { SearchContext } from '../../context/SearchContext';
import { AuthContext } from '../../context/AuthContext';
import { useProducts } from '../../hooks/useProducts';
import ProductList from '../../components/ProductList';
import NavBar from '../../components/NavBar';
import Slider from 'react-slick';

const MarketPage = () => {
  const { searchQuery } = useContext(SearchContext);
  const { user } = useContext(AuthContext); // Get the logged-in user
  const { products, error, totalPages, currentPage, setCurrentPage } = useProducts(searchQuery);
  const apiUrl = process.env.REACT_APP_API_URL;

  // State for recommended products with deduplication from localStorage
  const [recommendedProducts, setRecommendedProducts] = useState(() =>
    JSON.parse(localStorage.getItem('recommendedProducts')) || []
  );

  const [greatDeals, setGreatDeals] = useState([]);

  // Fetch collaborative recommendations and store in localStorage
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (user && user.token) {
        try {
          const response = await fetch('${apiUrl}/recommendations', {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          const data = await response.json();

          if (response.ok) {
            // Deduplicate products and filter out unlisted products
            const uniqueRecommendations = Array.from(
              new Set(data.map((product) => product._id))
            )
              .map((id) => data.find((product) => product._id === id))
              .filter((product) => product.listed); // Filter out unlisted products

            setRecommendedProducts(uniqueRecommendations);
            localStorage.setItem('recommendedProducts', JSON.stringify(uniqueRecommendations));
          } else {
            console.error('Error fetching recommendations:', data.error);
          }
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      }
    };

    fetchRecommendations();
  }, [user]);

  // 🚀 Track user interactions
  const trackInteraction = async (productId, interactionType) => {
    try {
      await fetch('${apiUrl}/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId, interactionType }),
      });
      console.log(`Tracked ${interactionType} interaction on product: ${productId}`);
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  // 🚀 Fetch "Great Deals" products (price <= 30)
  useEffect(() => {
    const fetchGreatDeals = async () => {
      if (user) {
        try {
          const response = await fetch('${apiUrl}/products/great-deals');
          const data = await response.json();
          if (response.ok) {
            // Filter out unlisted products
            setGreatDeals(data.filter(product => product.listed));
          }
        } catch (error) {
          console.error('Failed to fetch great deals', error);
        }
      }
    };
    fetchGreatDeals();
  }, [user]);

  // 🚀 Slider settings
  const sliderSettings = {
    dots: true,
    infinite: false, // Prevent infinite scroll to avoid repeating products
    speed: 500,
    slidesToShow: Math.min(recommendedProducts.length, 3),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Recommendations Section */}
        {user && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Recommendations for You</h2>
            {recommendedProducts.length > 0 ? (
              <Slider {...sliderSettings}>
                {recommendedProducts.map((product) => (
                  <div key={product._id} className="px-2">
                    <div
                      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      onClick={() => trackInteraction(product._id, 'view')}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-500">{product.description}</p>
                        <p className="text-indigo-600 font-bold">${product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-gray-500">No recommendations available at the moment. Try viewing more products!</p>
            )}
            <hr className="my-8 border-gray-300" />
          </div>
        )}

        {/* Marketplace Section */}
        <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ProductList products={products.filter(product => product.listed)} trackInteraction={trackInteraction} />

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* Great Deals Section */}
        {user && greatDeals.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Great Deals!</h2>
            <Slider {...sliderSettings}>
              {greatDeals.map((product) => (
                <div key={product._id} className="px-2">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-500">{product.description}</p>
                      <p className="text-indigo-600 font-bold">${product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
