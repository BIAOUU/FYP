import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser ? storedUser.token : null;

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('/api/user/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        const sortedUsers = data.sort((a, b) => {
          if (a.role === 'admin' && b.role !== 'admin') return 1;
          if (a.role !== 'admin' && b.role === 'admin') return -1;
          return 0;
        });

        setUsers(sortedUsers);
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">View User Accounts</h1>
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center space-x-4">
              <img
                src={`https://avatars.dicebear.com/api/initials/${user.email}.svg`}
                alt={user.email}
                className="w-10 h-10 rounded-full"
              />

              {user.role === 'admin' ? (
                <span className="font-medium text-lg text-gray-600">
                  {user.profile?.name}
                </span>
              ) : (
                <Link to={`/admin/users/${user._id}`} className="font-medium text-lg text-blue-600 hover:underline">
                  {user.profile?.name}
                </Link>
              )}
            </div>

            {/* User status and role */}
            <div className="flex flex-col items-end">
              <span className={`text-lg font-bold ${user.suspended ? 'text-orange-500' : 'text-green-500'}`}>
                {user.suspended ? 'Suspended' : 'Active'}  {/* Display suspended status */}
              </span>
              <span className="text-sm text-gray-500">Role: {user.role}</span>  {/* Display user role */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserManagementPage;
