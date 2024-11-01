import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { AuthContext } from '../../context/AuthContext';

const OwnListingsPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 8; 

    // Calculate the list of products for the current page
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / itemsPerPage); // Total number of pages

    useEffect(() => {
        if (!user) {
            navigate('/marketplace');
            return;
        }

        const fetchOwnProducts = async () => {
            try {
                const response = await fetch('/api/products/my-products', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOwnProducts();
    }, [user, navigate]);

    const handleDelete = async (productId) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Your Listings</h2>
                {error && <p className="text-red-500">{error}</p>}
                {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {currentProducts.map(product => (
                            <div key={product._id} className="relative bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className={`w-full h-48 object-cover ${!product.listed ? 'grayscale' : ''}`}
                                    />
                                    {!product.listed && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold italic transform rotate-12 font-poppins">Unavailable</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold font-poppins">{product.name}</h3>
                                    <p className="text-gray-500 font-poppins">{product.description}</p>
                                    <p className="text-indigo-600 font-bold font-poppins">${product.price}</p>
                                </div>
                                <div className="p-4 flex justify-between">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded font-poppins">Edit</button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded font-poppins" onClick={() => handleDelete(product._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 font-poppins">You have not listed any products yet.</p>
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

export default OwnListingsPage;
