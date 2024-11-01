import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation tool

const AdminFaqManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">FAQ Management</h1>

        {/* Buttons for managing FAQs */}
        <div className="space-y-4">
          {/* View FAQs button */}
          <div className="flex justify-between">
            <span>View FAQs</span>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => navigate('/admin/faqs/view')}
            >
              View
            </button>
          </div>

          {/* Post new FAQ button */}
          <div className="flex justify-between">
            <span>Post New FAQ</span>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => navigate('/admin/faqs/post')}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFaqManagementPage;
