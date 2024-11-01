import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import { SearchContext } from '../../context/SearchContext';
import ProductList from '../../components/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ContactSupport from '../../components/ContactSupport';

ChartJS.register(ArcElement, Tooltip, Legend);

const LandingPage = () => {
    const { searchQuery } = useContext(SearchContext);
    const { products, error } = useProducts(searchQuery);
    const [reviews, setReviews] = useState([]); // State to hold the reviews
    const isSearchEmpty = !searchQuery.search || searchQuery.search.trim() === '';
    const [faqs, setFaqs] = useState([]);
    const [ageData, setAgeData] = useState([0, 0, 0, 0]); // Initialize with zero data

    // Fetch age distribution data
    useEffect(() => {
        const fetchAgeDistribution = async () => {
            try {
                const response = await fetch('/api/user/age-distribution');
                const data = await response.json();
                setAgeData([data['21-30'], data['31-40'], data['<21'], data['>40']]);
            } catch (err) {
                console.error('Failed to fetch age distribution:', err);
            }
        };
        fetchAgeDistribution();
    }, []);

    const data = {
        labels: ['21 - 30 Years Old', '31 - 40 Years Old', 'Less than 21 Years Old', 'More than 40 Years Old'],
        datasets: [
            {
                label: 'Age Categories',
                data: ageData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 16,
                    },
                    boxWidth: 20,
                    padding: 20,
                },
            },
        },
    };

    // Fetch reviews with rating >= 3 stars
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/app-reviews'); // Fetch the reviews
                const data = await response.json();
                setReviews(data); // Set the fetched reviews to state
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        };
        fetchReviews();
    }, []);

    // Fetch the latest FAQs
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('/api/faqs');
                const data = await response.json();
                setFaqs(data.slice(-5).reverse()); // Get the last 5 FAQs
            } catch (err) {
                console.error('Failed to fetch FAQs:', err);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <div>
            <NavBar />
            {isSearchEmpty ? (
                <div>
                    <section className="relative h-[450px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white">
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-center px-4 sm:px-8">
                            <h1 className="text-5xl font-extrabold mb-4">
                                Welcome to Top Care Fashion!
                            </h1>
                            <p className="text-lg mb-6">
                                Discover a wide range of fashion items for every style. From casual to formal, we’ve got you covered.
                            </p>
                            <a href="#features" className="bg-white text-purple-500 py-3 px-6 rounded-full font-semibold hover:bg-gray-200">
                                See More
                            </a>
                        </div>
                    </section>

                    {/* Feature Section */}
                    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Easy Shopping</h3>
                                <p className="text-gray-600">Browse and shop with ease using our intuitive marketplace.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quality Products</h3>
                                <p className="text-gray-600">Our products are sourced from trusted sellers with high standards.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Find your Style with AI</h3>
                                <p className="text-gray-600">Our application allows user to find & customize their outfits using Artificial Intelligence & Computer Vision.</p>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Section with Pie Chart */}
                    <section className="text-center pb-20">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Application Age Statistics</h2>
                        <div className="w-1/2 mx-auto">
                            <Pie data={data} options={options} />
                        </div>

                        {/* Reviews Section */}
                        <section className="text-left mt-10 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6">User Reviews</h2>

                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="border border-gray-300 p-6 rounded-lg shadow-lg mb-6">
                                        <div className="flex items-center mb-2">
                                            <p className="text-lg font-bold mr-2">Rating:</p>
                                            <div className="flex">
                                                {[...Array(5)].map((star, i) => (
                                                    <svg
                                                        key={i}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill={i < review.rating ? 'yellow' : 'none'}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={i < review.rating ? 0 : 1}
                                                        className="w-6 h-6 text-yellow-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-lg italic mb-4">"{review.feedback}"</p>

                                        <div className="text-gray-500 text-sm">
                                            <p className="font-semibold">User: {review.user.profile.name}</p>
                                            <p>Submitted on: {new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews currently exists.</p>
                            )}
                        </section>

                        <section className="max-w-5xl mx-auto px-4 py-10 mt-10">
                            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                            <ul className="space-y-4">
                                {faqs.length > 0 ? (
                                    faqs.map((faq) => (
                                        <li key={faq._id} className="border border-gray-300 p-4 rounded-lg shadow">
                                            <h3 className="text-lg font-semibold">{faq.question}</h3>
                                            <p className="text-gray-700 mt-2">{faq.answer}</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>No FAQs available at the moment.</p>
                                )}
                            </ul>
                        </section>
                        
                        {/* Contact Support Section */}
                        <section className="max-w-5xl mx-auto px-4 py-10 mt-10">
                            <ContactSupport />
                        </section>
                    </section>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <ProductList products={products} />
                </div>
            )}
        </div>
    );
};

export default LandingPage;
