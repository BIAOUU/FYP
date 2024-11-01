import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io-client for real-time chat
import NavBar from '../../components/NavBar';
import { SearchContext } from '../../context/SearchContext';
import ProductList from '../../components/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { AuthContext } from '../../context/AuthContext';
import ReportModal from '../../components/ReportModal';

// Initialize socket.io connection
const socket = io(); // Make sure the server is running on the correct port

const ProductDetailsPage = () => {
    const { id } = useParams(); // Product ID
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access user context
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false); // Favorite state
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);  // Modal state
    const [messages, setMessages] = useState([]); // State for chat messages
    const [message, setMessage] = useState(''); // State for input message
    const [roomId, setRoomId] = useState(null); // Room ID for chat
    const [hasBought, setHasBought] = useState(false); // State for whether the user has bought the product

    const { searchQuery } = useContext(SearchContext);
    const { products } = useProducts(searchQuery);

    // Fetch product details and also check if it's already a favorite
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch product details.');
                }

                setProduct(data);

                // Fetch favorite status if the user is logged in
                if (user) {
                    const favoriteResponse = await fetch(`/api/favorite/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    const favoriteData = await favoriteResponse.json();

                    if (favoriteData.isFavorite) {
                        setIsFavorite(true); // Set the product as favorite
                    }
                }

                // Prepare room but don't join it until user clicks "Buy Product"
                if (user) {
                    const room = `${id}-${data.createdBy._id}`; // Create a unique room based on product and seller IDs
                    setRoomId(room);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProduct();
    }, [id, user]);

    // Join room and start listening for messages only after the "Buy" button is clicked
    useEffect(() => {
        if (hasBought && roomId) {
            socket.emit('join-room', { roomId });

            const handleMessage = (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            };

            // Add the event listener
            socket.on('receive-message', handleMessage);

            // Clean up the event listener when the component is unmounted or dependencies change
            return () => {
                // Remove the listener when effect cleans up or dependencies change
                socket.off('receive-message', handleMessage);
            };
        }
    }, [hasBought, roomId]);



    // Send a new message
    const handleSendMessage = () => {
        if (message && roomId) {
            const newMessage = {
                sender: user._id,
                content: message,
                timestamp: new Date().toLocaleString(),
            };
    
            // Emit the message to the server
            socket.emit('send-message', { roomId, message: newMessage });
    
            // Add the message to the local chat log
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage(''); // Clear the input field
        }
    };
    

    const handleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = isFavorite
                ? await fetch(`/api/favorite/${id}`, {
                      method: 'DELETE',
                      headers: {
                          Authorization: `Bearer ${user.token}`,
                      },
                  })
                : await fetch(`/api/favorite/${id}`, {
                      method: 'POST',
                      headers: {
                          Authorization: `Bearer ${user.token}`,
                      },
                  });

            if (!response.ok) {
                throw new Error('Failed to update favorite status');
            }

            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error('Failed to update favorite:', err);
        }
    };

    const handleReportSubmit = async (reason) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    product: id,
                    reason,
                    reporter: user._id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to report the product');
            }

            alert('Product reported successfully.');
            setIsReportModalOpen(false);  // Close the modal on success
        } catch (err) {
            console.error('Failed to report product:', err);
            alert('Failed to report the product. Please try again.');
        }
    };

    const handleBuy = () => {
        // Check if the user is logged in before allowing to "buy" the product
        if (!user) {
            navigate('/login'); // Navigate to login page if not logged in
            return;
        }

        // Simulate buying the product
        console.log('Buy clicked');
        setHasBought(true); // Set that the user has bought the product, enabling chat
    };

    return (
        <div>
            <NavBar />
            {searchQuery.search ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <ProductList products={products} />
                </div>
            ) : (
                <div className="max-w-4xl mx-auto p-6">
                    {error && <p className="text-red-500">{error}</p>}
                    {product ? (
                        <>
                            <div className="flex flex-col md:flex-row gap-6">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full md:w-1/2 h-auto object-cover rounded-lg"
                                />
                                <div className="md:w-1/2">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold text-gray-700">Product Name:</h2>
                                        <p className="text-2xl font-bold">{product.name}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold text-gray-700">Description:</h2>
                                        <p className="text-gray-600">{product.description}</p>
                                    </div>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-semibold text-gray-700">Price:</h2>
                                        <p className="text-indigo-600 font-bold text-2xl">${product.price}</p>
                                    </div>
                                    {product.sizes && (
                                        <div className="mb-4">
                                            <h2 className="text-lg font-semibold text-gray-700">Available Sizes:</h2>
                                            <div className="flex gap-2">
                                                {product.sizes.map(size => (
                                                    <span
                                                        key={size}
                                                        className="px-3 py-1 border border-gray-300 rounded-full">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="mb-4">
                                            <h2 className="text-lg font-semibold text-gray-700">Category:</h2>
                                            <p className="text-gray-500">{product.category.name}</p>
                                        </div>
                                    )}
                                    {product.createdBy && (
                                        <div className="mb-4">
                                            <h2 className="text-lg font-semibold text-gray-700">Created By:</h2>
                                            <Link to={`/user/${product.createdBy._id}`} className="text-indigo-600 hover:underline">
                                                {product.createdBy.profile.name}
                                            </Link>
                                        </div>
                                    )}
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            onClick={handleFavorite}
                                            className={`${isFavorite ? 'text-red-500' : 'text-gray-500'} hover:text-red-700`}>
                                            <i className={`fas fa-heart fa-lg ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}></i>
                                        </button>
                                        <button
                                            onClick={() => setIsReportModalOpen(true)}
                                            className="text-gray-500 hover:text-gray-700">
                                            <i className="fas fa-flag fa-lg"></i>
                                        </button>
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleBuy}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                                            Buy Product
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Section - Visible only after user buys the product */}
                            {hasBought && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold">Chat with Seller</h3>
                                    <div className="border rounded-lg p-4 h-64 overflow-y-scroll">
                                        {messages.map((msg, idx) => (
                                            <p key={idx}><strong>{msg.sender === user._id ? 'You' : 'Seller'}:</strong> {msg.content}</p>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="border border-gray-300 p-2 rounded-lg w-full"
                                            placeholder="Type your message..." />
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Loading product details...</p>
                    )}
                </div>
            )}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReportSubmit}
            />
        </div>
    );
};

export default ProductDetailsPage;
