import React, { useState, useEffect } from 'react';

const AdminViewFaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [answerInput, setAnswerInput] = useState({});

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = storedUser ? storedUser.token : null;

        const response = await fetch('/api/faqs', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }

        const data = await response.json();
        const sortedFaqs = [...data].sort((a, b) => (a.answer ? 1 : -1));
        setFaqs(sortedFaqs);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFaqs();
  }, []);

  const handleAnswerChange = (faqId, value) => {
    setAnswerInput({ ...answerInput, [faqId]: value });
  };

  const handlePostAnswer = async (faqId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser ? storedUser.token : null;

      const response = await fetch(`/api/faqs/${faqId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answer: answerInput[faqId] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post answer');
      }

      const updatedFaq = await response.json();
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq._id === updatedFaq._id ? updatedFaq : faq))
      );
      setAnswerInput((prevInput) => ({ ...prevInput, [faqId]: '' }));
    } catch (error) {
      setError(error.message);
    }
  };

  // Add functionality to delete FAQ
  const handleDeleteFaq = async (faqId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser ? storedUser.token : null;

      const response = await fetch(`/api/faqs/${faqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }

      // Update FAQ list after successful deletion
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">View FAQs</h2>
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <li key={faq._id} className="p-4 border border-gray-300 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {faq.answer ? (
                  <p className="text-gray-700 mt-2">{faq.answer}</p>
                ) : (
                  <div className="mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                      onClick={() =>
                        setAnswerInput((prevInput) => ({
                          ...prevInput,
                          [faq._id]: answerInput[faq._id] || '',
                        }))
                      }
                    >
                      Answer
                    </button>
                    {answerInput[faq._id] !== undefined && (
                      <div className="mt-4 space-y-4">
                        <textarea
                          value={answerInput[faq._id]}
                          onChange={(e) => handleAnswerChange(faq._id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Enter your answer here..."
                        />
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                          onClick={() => handlePostAnswer(faq._id)}
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add delete button */}
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                onClick={() => handleDeleteFaq(faq._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No FAQs available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminViewFaqPage;
