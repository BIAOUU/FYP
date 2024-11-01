import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';

const EditProfilePage = () => {
  const { user, dispatch } = useAuthContext();  // Access dispatch
  const [formData, setFormData] = useState({
    name: user?.profile?.name || user?.name || '',  // Map profile.name to user.name
    email: user?.email || '',
    password: '',
    categoryPreferences: user?.categoryPreferences?.[0] || '',  // Use scalar for category preference
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch categories for category preferences
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();  // Get updated user data from the server

      // Map profile.name to user.name for localStorage and AuthContext
      const newUser = {
        ...user,
        name: updatedUser.user.profile.name,  // Map profile.name to user.name
        email: updatedUser.user.email,
        categoryPreferences: updatedUser.user.categoryPreferences,
      };

      // Save updated user data to local storage
      localStorage.setItem('user', JSON.stringify(newUser));

      // Dispatch action to update context
      dispatch({ type: 'LOGIN', payload: newUser });

      // Redirect after successful update
      navigate('/marketplace');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password (leave blank to keep the same)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category Preferences</label>
            <select
              name="categoryPreferences"
              value={formData.categoryPreferences}  // Use scalar value for categoryPreferences
              onChange={(e) => setFormData({ ...formData, categoryPreferences: e.target.value })}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
