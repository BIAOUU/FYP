import React, { useState, useEffect } from 'react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);  // Store the list of categories
  const [newCategory, setNewCategory] = useState('');  // Name of the new category
  const [editCategoryId, setEditCategoryId] = useState(null);  // ID of the currently edited category
  const [editCategoryName, setEditCategoryName] = useState('');  // Name of the category being edited
  const [error, setError] = useState(null);  // Error message
  const [isSubmitting, setIsSubmitting] = useState(false);  // Submission status

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser ? storedUser.token : null;

        const response = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);  // Store the categories
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // Handle edit button click
  const handleEditClick = (category) => {
    setEditCategoryId(category._id);  // Set the ID of the category being edited
    setEditCategoryName(category.name);  // Set the name of the category being edited
  };

  // Handle category name change during edit
  const handleEditInputChange = (e) => {
    setEditCategoryName(e.target.value);
  };

  // Handle the submission of category updates
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser ? storedUser.token : null;

      const response = await fetch(`/api/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editCategoryName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const updatedCategory = await response.json();

      // Update the local list of categories
      setCategories(categories.map(cat => (cat._id === editCategoryId ? updatedCategory : cat)));
      setEditCategoryId(null);  // Clear edit state
      setEditCategoryName('');  // Clear input field
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category deletion
  const handleDeleteClick = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser ? storedUser.token : null;

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Remove the deleted category from the local list
      setCategories(categories.filter((category) => category._id !== categoryId));
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle input for new category
  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Handle the submission of a new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser ? storedUser.token : null;

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const createdCategory = await response.json();

      // Update the local list of categories
      setCategories([...categories, createdCategory]);
      setNewCategory('');  // Clear input field
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto p-8">
      {/* Category list */}
      <div className="w-1/2 p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <ul className="border rounded-lg divide-y">
          {categories.map((category) => (
            <li key={category._id} className="p-2 flex justify-between items-center">
              {editCategoryId === category._id ? (
                <form onSubmit={handleEditSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={handleEditInputChange}
                    className="border p-2 rounded"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(category._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(category)}
                    className="w-full text-left p-2 bg-white border rounded hover:bg-blue-100 focus:outline-none"
                  >
                    {category.name}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Create category form */}
      <div className="w-1/2 p-4 ml-4 bg-white border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create Categories</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategory}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
