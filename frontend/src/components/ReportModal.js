import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason) {
            onSubmit(reason);
            setReason('');
        } else {
            alert('Please provide a reason for reporting.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Report Product</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why you are reporting this product..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows={5}
                />
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
