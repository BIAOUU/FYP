import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';

const UserFaqPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const faqsPerPage = 6;

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('/api/faqs');
                if (!response.ok) {
                    throw new Error('Failed to fetch FAQs');
                }
                const data = await response.json();
                const answeredFaqs = data.filter(faq => faq.answer); // Display only answered FAQs
                setFaqs(answeredFaqs);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchFaqs();
    }, []);

    // Pagination Logic
    const indexOfLastFaq = currentPage * faqsPerPage;
    const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
    const currentFaqs = faqs.slice(indexOfFirstFaq, indexOfLastFaq);
    const totalPages = Math.ceil(faqs.length / faqsPerPage);

    return (
        <div>
            <NavBar />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* FAQ title and link to unanswered questions */}
                <div className="flex justify-between items-start">
                    <h1 className="text-8xl font-bold leading-none">FAQ</h1>
                    <div className="text-right">
                        <p className="font-bold">Unanswered Questions?</p>
                        <a href="/ask-question" className="text-blue-600 underline">Ask us!</a>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="flex mt-10">
                    <div className="flex-grow">
                        {error && <p className="text-red-500">{error}</p>}
                        {faqs.length > 0 ? (
                            <ul className="space-y-8">
                                {currentFaqs.map(faq => (
                                    <li key={faq._id} className="border-b-2 pb-4">
                                        <h3 className="text-2xl font-semibold">{faq.question}</h3>
                                        <p className="mt-2 text-gray-700">{faq.answer}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No FAQs available.</p>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-lg">
                        {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFaqPage;
