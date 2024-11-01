import React from 'react';
import AdminNavBar from '../../components/AdminNavBar';  // Import the admin-specific NavBar
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AdminLandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <AdminNavBar /> {/* Use the AdminNavBar */}
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Admin Page</h1>

                {/* Buttons for different admin functionalities */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>View User Accounts</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/users')} // Redirect to user accounts page
                        >
                            View
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <span>View Categories</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/categories')} // Redirect to categories page
                        >
                            View
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <span>View Listed Products</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/products')} // Redirect to listed products page
                        >
                            View
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <span>View FAQ Queries</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/faqs')} // Redirect to FAQ management page
                        >
                            View
                        </button>
                    </div>

                    <div className="flex justify-between">
                        <span>View Reports</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/reports')}
                        >
                            View
                        </button>
                    </div>
                    <div className="flex justify-between">
                        <span>View Survey</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/survey')}
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLandingPage;
