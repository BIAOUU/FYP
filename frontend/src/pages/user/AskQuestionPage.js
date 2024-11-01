import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AskQuestionPage = () => {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    const handlePostQuestion = async () => {
        setError(null);
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/faqs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ question: question.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post question');
            }

            setQuestion('');
            navigate('/faq');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="bg-white border border-gray-300 shadow-md p-8">
                {/* User info and question input */}
                <div className="flex items-start mb-6">
                    <img
                        src={user?.avatarUrl || '/path-to-default-avatar'} // Dynamically display user avatar
                        alt="User avatar"
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <h3 className="text-lg font-bold">{user?.name || 'Guest'}</h3>
                        <p className="text-gray-600">Posting Queries</p>
                    </div>
                </div>

                {/* Question text input */}
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                    placeholder="Share your Questions with us"
                    disabled={isLoading} // Disable input to prevent multiple clicks
                />

                {/* Display error message */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => navigate('/faq')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePostQuestion}
                        className="bg-black text-white px-4 py-2 rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskQuestionPage;
