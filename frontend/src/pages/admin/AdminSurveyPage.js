import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSurveyPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Survey Management</h1>

                <div className="space-y-4">
                    {/* View surveys */}
                    <div className="flex justify-between">
                        <span>View Surveys</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/survey/view')}
                        >
                            View
                        </button>
                    </div>

                    {/* Create a new survey */}
                    <div className="flex justify-between">
                        <span>Create Survey</span>
                        <button
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            onClick={() => navigate('/admin/survey/create')}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSurveyPage;
