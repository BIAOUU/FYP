import React, { useState } from 'react';

const AdminFaqPostPage = () => {
  const [question, setQuestion] = useState('');  // Input for the question
  const [answer, setAnswer] = useState('');  // Input for the answer
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  // 控制成功提示框

  // Handle FAQ submission
  const handlePostFAQ = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));  // Retrieve logged-in user info
      const token = storedUser ? storedUser.token : null;

      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer }),  // Send question and answer
      });

      if (!response.ok) {
        throw new Error('Failed to post FAQ');
      }

      // Clear the input fields
      setQuestion('');
      setAnswer('');

      // 显示成功提示框
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);  // 提示框2秒后消失

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Post New FAQ</h1>
      {error && <p className="text-red-500">{error}</p>}  {/* Display error message */}

      {showSuccessMessage && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
          FAQ posted successfully!
        </div>
      )}

      {/* Input for question */}
      <div className="mb-4">
        <label className="block text-xl font-semibold mb-2">Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter your question"
        />
      </div>

      {/* Input for answer */}
      <div className="mb-6">
        <label className="block text-xl font-semibold mb-2">Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Provide your answer here"
        />
      </div>

      {/* Submit and reset buttons */}
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded-md"
          onClick={() => setQuestion('') & setAnswer('')}  // Reset form
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handlePostFAQ}  // Submit FAQ
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default AdminFaqPostPage;
