import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ManageProductPage = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        sizes: [],
        description: '',
        price: '',
        imageUrl: '',
        listed: true,
        category: ''  // Current product's category ID
    });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');  // For displaying the image preview
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

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
                setProduct(data);
                setImagePreview(data.imageUrl);  // Set image preview
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));  // Preview the selected image
    };

    const uploadImage = async () => {
        if (!imageFile) return product.imageUrl;  // If no new image is uploaded, use the original image
    
        const formData = new FormData();
        formData.append('image', imageFile);
    
        try {
            const response = await fetch(`/api/products/${id}`, {  // Use the existing product update route
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            const data = await response.json();
            return data.imageUrl;  // Return the uploaded image URL
        } catch (err) {
            setError(err.message);
            return product.imageUrl;  // Return the original image URL on failure
        }
    };
    
    const handleCategoryChange = (e) => {
        setProduct({
            ...product,
            category: e.target.value
        });
    };

    // Toggle the product's listed status
    const handleToggleListStatus = async () => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listed: !product.listed })  // Toggle listed status
            });

            if (!response.ok) {
                throw new Error(`Failed to ${product.listed ? 'unlist' : 'list'} product`);
            }

            setProduct({ ...product, listed: !product.listed });  // Update local state

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 1000);
        } catch (err) {
            setError(`Failed to ${product.listed ? 'unlist' : 'list'} product`);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const imageUrl = await uploadImage();  // Upload image and get image URL
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ...product, imageUrl })  // Update product info and image URL
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                navigate('/admin/products');
            }, 1000);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="product-management max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Manage Listed Product</h1>

            {error && <p className="text-red-500">{error}</p>}

            {showSuccessMessage && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                    Product {product.listed ? 'listed' : 'unlisted'} successfully!
                </div>
            )}

            <div className="grid grid-cols-3 gap-8">
                {/* Image preview and upload */}
                <div className="col-span-1">
                    <img
                        src={imagePreview || product.imageUrl}
                        alt="Product"
                        className="w-full h-64 object-cover mb-4"
                    />
                    <input type="file" onChange={handleImageChange} className="text-blue-500 underline" />
                </div>

                <div className="col-span-1">
                    <h2 className="text-lg font-bold">Item Name</h2>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                    <h2 className="text-lg font-bold">Size</h2>
                    <input
                        type="text"
                        name="sizes"
                        value={product.sizes}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                    <h2 className="text-lg font-bold">Description</h2>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                    <h2 className="text-lg font-bold">Price</h2>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>

                <div className="col-span-1">
                    <h2 className="text-lg font-bold mb-2">Categories</h2>
                    <select
                        value={product.category}
                        onChange={handleCategoryChange}
                        className="p-2 border w-full mb-4"
                    >
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
                <button
                    onClick={handleToggleListStatus}
                    className={`bg-${product.listed ? 'red' : 'green'}-500 text-white px-6 py-3 rounded text-lg font-semibold`}
                >
                    {product.listed ? 'Unlist' : 'List'}
                </button>
                <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-semibold"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
};

export default ManageProductPage;
