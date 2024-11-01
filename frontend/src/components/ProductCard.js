import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onDelete, isOwnListings, trackInteraction }) => {
    const navigate = useNavigate();  // React Router v6 hook for navigation

    // Handle navigation to product details
    const handleProductClick = (e) => {
        if (typeof trackInteraction === 'function') {
            trackInteraction(product._id, 'view');  // Track the view interaction only if it's defined
        } else {
            console.warn('trackInteraction is not a function');
        }
        e.stopPropagation();
        navigate(`/product/${product._id}`);
    };

    return (
        <div
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleProductClick}  // Navigate when the card is clicked
        >
            {/* Product Image */}
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover" 
                draggable={false}  // Disable image dragging to avoid interference with clicking
            />

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.description}</p>
                <p className="text-indigo-600 font-bold">${product.price}</p>

                {/* Conditionally render Edit and Delete buttons for own listings */}
                {isOwnListings && (
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from triggering
                                navigate(`/edit-product/${product._id}`);
                            }}
                            className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click from triggering
                                onDelete(product._id);
                            }}
                            className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
