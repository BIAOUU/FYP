import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar'; 
import { AuthContext } from '../../context/AuthContext';  // Import AuthContext

const EditProductPage = () => {
    const { id } = useParams();  // Get the product ID from the URL
    const { user } = useContext(AuthContext);  // Use context to get the user
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        sizes: [],
        imageUrl: ''  // Include the imageUrl field here
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');  // Redirect to login if not logged in
            return;
        }

        // Fetch the existing product details
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);  // Set product data including imageUrl
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProduct();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            navigate('/own-listings');  // Redirect to the user's listings after a successful update
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/own-listings');  // Navigate back to own listings without saving changes
    };

    return (
        <div>
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
                {error && <p className="text-red-500">{error}</p>}

                {/* Display the product image */}
                {product.imageUrl && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Product Image</label>
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-48 h-48 object-cover rounded-md" 
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"  // Use type="button" to prevent form submission
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductPage;
