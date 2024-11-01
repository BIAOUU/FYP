import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavBar from '../../components/NavBar';

const StyleOutfitPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageUploaded(true);
      setError('');
    }
  };

  const findRecommendations = async () => {
    if (!selectedFile) {
      setError('Please upload an image to find recommendations.');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/products/generate-recommendations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch recommendations');

      setDescription(data.description);
      setRecommendedItems(data.recommendations);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to product details page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Style Your Outfit</h1>
        <p className="text-lg text-gray-600">Upload an image to get product recommendations!</p>

        <div className="mt-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full max-w-xs px-4 py-2 border rounded-md shadow-sm"
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Uploaded Image Preview:</h2>
            <img
              src={imagePreview}
              alt="Uploaded Outfit"
              className="w-60 h-60 object-contain mt-2 rounded-md shadow-lg"
            />
          </div>
        )}

        <button
          onClick={findRecommendations}
          className={`mt-6 px-6 py-2 rounded text-white ${isImageUploaded ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!isImageUploaded || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Find Your Outfit!'}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Generated Description:</h2>
            <p className="text-gray-700">{description}</p>
          </div>
        )}

        {recommendedItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Recommended Items:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {recommendedItems.map((item) => (
                <div
                  key={item._id}
                  className="border p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(item._id)} // Add click handler
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="font-bold text-indigo-600">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleOutfitPage;
