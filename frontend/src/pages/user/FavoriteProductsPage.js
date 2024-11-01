import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import ProductList from '../../components/ProductList';
import { AuthContext } from '../../context/AuthContext';

const FavoriteProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);  // Current page
    const itemsPerPage = 8;  // Display 8 products per page

    // Calculate the list of products for the current page
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / itemsPerPage);  // Total number of pages

    useEffect(() => {
        if (!user) {
            navigate('/login');  // Redirect to login page if not logged in
            return;
        }

        const fetchFavorites = async () => {
            try {
                const response = await fetch('/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch favorite products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchFavorites();
    }, [user, navigate]);

    // 🚀 Define the trackInteraction function
    const trackInteraction = async (productId, interactionType) => {
        try {
            await fetch('/api/interactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ productId, interactionType }),
            });
            console.log(`Tracked ${interactionType} on product: ${productId}`);
        } catch (error) {
            console.error('Failed to track interaction:', error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Your Favorite Products</h2>
                {error && <p className="text-red-500">{error}</p>}
                {currentProducts.length > 0 ? (
                    // Pass trackInteraction to ProductList
                    <ProductList products={currentProducts} trackInteraction={trackInteraction} />
                ) : (
                    <p className="text-gray-500">You have no favorite products yet.</p>
                )}

                {/* Pagination buttons, always displayed */}
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
            </div>
        </div>
    );
};

export default FavoriteProductsPage;
