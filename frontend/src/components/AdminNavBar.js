import React from 'react';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminNavBar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');  // Redirect to login after logout
    };

    return (
        <div className="bg-indigo-600 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                {/* Admin Landing Page Logo */}
                <div className="text-white text-xl font-semibold">
                    <span>Admin Dashboard</span>
                </div>

                {/* Logout Button */}
                {user && (
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default AdminNavBar;
