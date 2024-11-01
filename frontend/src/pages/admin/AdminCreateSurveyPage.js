import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Used to display star icons

const AdminCreateSurveyPage = () => {
    const [title, setTitle] = useState('Untitled Form');
    const [description, setDescription] = useState('Form Description');
    const [questions, setQuestions] = useState([
        { id: 1, type: 'multipleChoice', options: ['', ''] },
    ]);

    // Add a new question
    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: questions.length + 1, type: 'shortAnswer', options: [''] },
        ]);
    };

    // Remove a question
    const removeQuestion = (id) => {
        setQuestions(questions.filter((question) => question.id !== id));
    };

    // Handle question type change
    const handleQuestionTypeChange = (id, type) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, type } : q
        );
        setQuestions(updatedQuestions);
    };

    // Handle option change
    const handleOptionChange = (id, optionIndex, value) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id
                ? {
                      ...q,
                      options: q.options.map((option, index) =>
                          index === optionIndex ? value : option
                      ),
                  }
                : q
        );
        setQuestions(updatedQuestions);
    };

    // Add an option
    const addOption = (id) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id
                ? { ...q, options: [...q.options, ''] }
                : q
        );
        setQuestions(updatedQuestions);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6">Create User Survey</h2>

            <div className="mb-8">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 text-xl font-bold mb-2 border border-gray-300 rounded"
                    placeholder="Untitled Form"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 text-lg border border-gray-300 rounded"
                    placeholder="Form Description"
                />
            </div>

            {/* Questions section */}
            {questions.map((question, index) => (
                <div
                    key={question.id}
                    className="mb-6 p-4 border border-gray-300 rounded-lg"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Question {index + 1}</h3>
                        <select
                            value={question.type}
                            onChange={(e) =>
                                handleQuestionTypeChange(question.id, e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="shortAnswer">Short Answer</option>
                            <option value="starRating">Star Rating</option> {/* Star Rating added */}
                        </select>
                    </div>

                    {/* If it's a multiple-choice question, render options */}
                    {question.type === 'multipleChoice' && (
                        <>
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center mt-2">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        className="mr-2"
                                        disabled
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                question.id,
                                                optionIndex,
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="Option"
                                    />
                                </div>
                            ))}
                            <button
                                className="mt-2 text-blue-500"
                                onClick={() => addOption(question.id)}
                            >
                                + Add Option
                            </button>
                        </>
                    )}

                    {/* If it's a short answer question */}
                    {question.type === 'shortAnswer' && (
                        <input
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded"
                            placeholder="Short answer text"
                            disabled
                        />
                    )}

                    {/* If it's a star rating question */}
                    {question.type === 'starRating' && (
                        <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar key={star} className="text-yellow-500 mr-1" />
                            ))}
                            <span className="ml-2 text-gray-600">(Star Rating)</span>
                        </div>
                    )}

                    {/* Delete question button */}
                    {questions.length > 1 && (
                        <button
                            className="mt-4 text-red-500"
                            onClick={() => removeQuestion(question.id)}
                        >
                            Delete Question
                        </button>
                    )}
                </div>
            ))}

            {/* Add new question button */}
            <button
                className="w-full p-2 mt-4 bg-blue-500 text-white rounded"
                onClick={addQuestion}
            >
                + Add Question
            </button>
        </div>
    );
};

export default AdminCreateSurveyPage;
