import React, { useContext, useState, useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { SearchContext } from '../context/SearchContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const { setSearchQuery } = useContext(SearchContext);
    const [filter, setFilter] = useState('Best Match');
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate(); // Get navigate function from react-router

    useEffect(() => {
        // Clear the search query if the user navigates away from the Marketplace
        if (location.pathname !== '/marketplace') {
            setSearchQuery({});
        }
    }, [location.pathname, setSearchQuery]);

    const handleLogout = () => {
        logout();
        navigate('/marketplace');  // Redirect to marketplace after logout
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setSearchQuery(prev => ({ ...prev, sort: e.target.value }));
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);  // Toggle dropdown visibility
    };

    // Navigate to favorites page when the heart icon is clicked
    const handleFavoritesClick = () => {
        navigate('/favorites');
    };

    return (
        <div className="bg-indigo-600 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                {/* Logo */}
                <div className="text-white text-xl font-semibold">
                    <Link to="/">Top Care Fashion</Link>
                </div>

                {/* Search Bar */}
                <div className="flex-grow mx-4 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search for products"
                        onChange={(e) => setSearchQuery(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    {/* Conditionally render the filter dropdown only on the Marketplace page */}
                    {location.pathname === '/marketplace' && (
                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="Best Match">Best Match</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="category">Category</option>
                        </select>
                    )}
                </div>

                {/* User Actions */}
                <div className="flex items-center space-x-4 relative">
                    {/* Always show the Marketplace icon */}
                    <Link to="/marketplace" className="text-white">
                        <i className="fas fa-store"></i>
                    </Link>

                    {user ? (
                        <>
                            {/* Icons for Wishlist, Feedback (only when user is logged in) */}
                            <button onClick={handleFavoritesClick} className="text-white">
                                <i className="fas fa-heart"></i>
                            </button>
                            
                            {/* Feedback Icon: Only for logged-in users */}
                            <Link to="/rate-experience" className="text-white">
                                <i className="fas fa-comment-dots"></i> {/* Feedback icon */}
                            </Link>

                            <Link to="/faq" className="text-white font-bold">FAQ</Link>

                            {/* User Info and Profile Dropdown */}
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-2 cursor-pointer" 
                                    onClick={toggleDropdown}
                                >
                                    <img
                                        src={`https://avatars.dicebear.com/api/initials/${user.name}.svg`}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-white">
                                        Hello, {user.name}
                                    </span>
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                        <Link 
                                            to="/own-listings" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Own Listings
                                        </Link>
                                        <Link 
                                            to="/favorites" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Favorites
                                        </Link>
                                        <Link 
                                            to="/sell-product" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Sell Product
                                        </Link>
                                        {/* New "Style your Outfit" Link */}
                                        <Link 
                                            to="/style-outfit" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Style your Outfit
                                        </Link>
                                        <Link 
                                            to="/edit-profile" 
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Edit Profile
                                        </Link>

                                        <div className="border-t border-gray-200"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
