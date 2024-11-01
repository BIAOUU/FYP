import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import { AuthContext } from '../../context/AuthContext'; 
import NavBar from '../../components/NavBar'; 

const RateExperience = () => {
    const { user } = useContext(AuthContext);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(1);
    const [hoverRating, setHoverRating] = useState(0); // For hover effect on stars
    const [uiSatisfaction, setUiSatisfaction] = useState(3);
    const [outfitSatisfaction, setOutfitSatisfaction] = useState(3);
    const [aiSatisfaction, setAiSatisfaction] = useState(3);
    const [uxSatisfaction, setUxSatisfaction] = useState(3);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();  

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user) {
            setMessage('You need to be logged in to submit feedback.');
            return;
        }
    
        if (!feedback) {
            setMessage('Please provide your feedback before submitting.');
            return;
        }
    
        try {
            const response = await fetch('/api/app-reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ 
                    feedback, 
                    rating, 
                    uiSatisfaction, 
                    outfitSatisfaction, 
                    aiSatisfaction, 
                    uxSatisfaction 
                }), 
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error);
            }
    
            setMessage('Thank you for your feedback!');
            setFeedback('');
            setRating(1);  

            setTimeout(() => {
                navigate('/marketplace');
            }, 1000);  
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };
    
    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <label key={index}>
                    <input 
                        type="radio" 
                        name="rating" 
                        value={starValue}
                        onClick={() => setRating(starValue)}
                        className="hidden"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={starValue <= (hoverRating || rating) ? 'yellow' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={starValue <= (hoverRating || rating) ? 0 : 1}
                        className={`w-8 h-8 cursor-pointer ${
                            starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                </label>
            );
        });
    };

    return (
        <div>
            <NavBar />

            <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-6">Rate Your Experience!</h2>

                {message && <p className={`text-center mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-center mb-6">Satisfaction Survey</h3>

                        {/* User Interface Satisfaction */}
                        <div className="mb-6">
                            <p className="font-bold">User Interface</p>
                            <div className="flex justify-between">
                                <label><input type="radio" value={1} checked={uiSatisfaction === 1} onChange={() => setUiSatisfaction(1)} /> Very Dissatisfied</label>
                                <label><input type="radio" value={2} checked={uiSatisfaction === 2} onChange={() => setUiSatisfaction(2)} /> Dissatisfied</label>
                                <label><input type="radio" value={3} checked={uiSatisfaction === 3} onChange={() => setUiSatisfaction(3)} /> Neutral</label>
                                <label><input type="radio" value={4} checked={uiSatisfaction === 4} onChange={() => setUiSatisfaction(4)} /> Satisfied</label>
                                <label><input type="radio" value={5} checked={uiSatisfaction === 5} onChange={() => setUiSatisfaction(5)} /> Very Satisfied</label>
                            </div>
                        </div>

                        {/* Outfit Recommendations Satisfaction */}
                        <div className="mb-6">
                            <p className="font-bold">Outfit Recommendations</p>
                            <div className="flex justify-between">
                                <label><input type="radio" value={1} checked={outfitSatisfaction === 1} onChange={() => setOutfitSatisfaction(1)} /> Very Dissatisfied</label>
                                <label><input type="radio" value={2} checked={outfitSatisfaction === 2} onChange={() => setOutfitSatisfaction(2)} /> Dissatisfied</label>
                                <label><input type="radio" value={3} checked={outfitSatisfaction === 3} onChange={() => setOutfitSatisfaction(3)} /> Neutral</label>
                                <label><input type="radio" value={4} checked={outfitSatisfaction === 4} onChange={() => setOutfitSatisfaction(4)} /> Satisfied</label>
                                <label><input type="radio" value={5} checked={outfitSatisfaction === 5} onChange={() => setOutfitSatisfaction(5)} /> Very Satisfied</label>
                            </div>
                        </div>

                        {/* AI Outfit Style Recommendation Satisfaction */}
                        <div className="mb-6">
                            <p className="font-bold">AI Outfit Style Recommendation</p>
                            <div className="flex justify-between">
                                <label><input type="radio" value={1} checked={aiSatisfaction === 1} onChange={() => setAiSatisfaction(1)} /> Very Dissatisfied</label>
                                <label><input type="radio" value={2} checked={aiSatisfaction === 2} onChange={() => setAiSatisfaction(2)} /> Dissatisfied</label>
                                <label><input type="radio" value={3} checked={aiSatisfaction === 3} onChange={() => setAiSatisfaction(3)} /> Neutral</label>
                                <label><input type="radio" value={4} checked={aiSatisfaction === 4} onChange={() => setAiSatisfaction(4)} /> Satisfied</label>
                                <label><input type="radio" value={5} checked={aiSatisfaction === 5} onChange={() => setAiSatisfaction(5)} /> Very Satisfied</label>
                            </div>
                        </div>

                        {/* User Experience Satisfaction */}
                        <div className="mb-6">
                            <p className="font-bold">User Experience</p>
                            <div className="flex justify-between">
                                <label><input type="radio" value={1} checked={uxSatisfaction === 1} onChange={() => setUxSatisfaction(1)} /> Very Dissatisfied</label>
                                <label><input type="radio" value={2} checked={uxSatisfaction === 2} onChange={() => setUxSatisfaction(2)} /> Dissatisfied</label>
                                <label><input type="radio" value={3} checked={uxSatisfaction === 3} onChange={() => setUxSatisfaction(3)} /> Neutral</label>
                                <label><input type="radio" value={4} checked={uxSatisfaction === 4} onChange={() => setUxSatisfaction(4)} /> Satisfied</label>
                                <label><input type="radio" value={5} checked={uxSatisfaction === 5} onChange={() => setUxSatisfaction(5)} /> Very Satisfied</label>
                            </div>
                        </div>
                    </div>

                    {/* Application Rating Section */}
                    <div className="mb-6 text-center">
                        <label htmlFor="rating" className="block text-gray-700 text-xl mb-2 font-bold">Rate the Application</label>
                        <div className="flex justify-center">
                            {renderStars()}
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="mb-6">
                        <label htmlFor="feedback" className="block text-gray-700">Your Feedback:</label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            rows="4"
                            placeholder="Let us know your thoughts..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 mt-2 w-full focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateExperience;
